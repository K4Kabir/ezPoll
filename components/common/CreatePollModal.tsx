'use client';

import React, { useContext, useState } from 'react';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, Trash } from 'lucide-react';
import { User } from '@/lib/contexts/UserContext';


interface FormData {
    title: string
    description: string
}

export default function CreatePollModal() {
    const [data, setData] = useState<FormData>({ title: "", description: "" });
    const [options, setOptions] = useState<string[]>(['']);
    const [validity, setValidity] = useState<string>("10")
    const [isSubmitting, setIsSubmitting] = useState(false);
    const createPoll = useMutation(api.polls.createPoll);
    const { userId } = useContext(User)

    const handleInput = function (e: React.ChangeEvent<HTMLInputElement>) {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }

    const addOption = () => setOptions([...options, '']);
    const updateOption = (value: string, index: number) => {
        const updated = [...options];
        updated[index] = value;
        setOptions(updated);
    };

    const deleteOption = (index: number) => {
        const updated = [...options];
        updated.splice(index, 1);
        setOptions(updated);
    };

    const handleSubmit = async () => {
        if (!data.title.trim() || options.some((opt) => !opt.trim()) || !userId) return;

        setIsSubmitting(true);
        try {
            await createPoll({
                title: data.title,
                description: data?.description,
                validTill: validity,
                options: options,
                createdBy: userId,
            });
            // Reset form
            setData({ description: "", title: "" });
            setOptions(['']);
        } catch (err) {
            console.error('Create Poll Error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Create Poll</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a New Poll</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 gap-1.5">
                    <div>
                        <Label>Title</Label>
                        <Input
                            placeholder="Enter poll title"
                            name='title'
                            value={data?.title ?? ""}
                            onChange={(e) => handleInput(e)}
                        />
                    </div>

                    <div>
                        <Label>Description</Label>
                        <Input
                            placeholder="Enter poll title"
                            name='description'
                            value={data?.description ?? ""}
                            onChange={(e) => handleInput(e)}
                        />
                    </div>


                    <div>
                        <Label>Valid Till</Label>
                        <Select value={validity} onValueChange={(value: string) => setValidity(value)}>
                            <SelectTrigger className='w-full'>
                                <SelectValue placeholder="Validity" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10">10 mins</SelectItem>
                                <SelectItem value="15">15 mins</SelectItem>
                                <SelectItem value="60">1 hr</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2 gap-1.5">
                        <Label>Options</Label>
                        {options.map((opt, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <Input
                                    placeholder={`Option ${index + 1}`}
                                    value={opt}
                                    onChange={(e) => updateOption(e.target.value, index)}
                                />
                                {
                                    options?.length > 1 && <Button variant="ghost" onClick={() => deleteOption(index)}>
                                        <Trash className="w-4 h-4" />
                                    </Button>
                                }

                            </div>
                        ))}
                        <Button variant="ghost" onClick={addOption}>
                            <Plus /> Add Option
                        </Button>
                    </div>
                </div>

                <DialogFooter className="mt-4">
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>

                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? 'Creating...' : 'Create'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
