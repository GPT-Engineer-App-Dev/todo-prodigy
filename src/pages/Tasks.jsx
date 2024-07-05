import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const taskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  dueDate: z.date().optional(),
  priority: z.enum(["Low", "Medium", "High"]).optional(),
});

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(taskSchema),
  });

  const addTask = (data) => {
    setTasks([...tasks, { ...data, id: Date.now() }]);
    toast("Task added successfully");
    reset();
  };

  const editTask = (data) => {
    setTasks(tasks.map(task => task.id === editingTask.id ? { ...task, ...data } : task));
    toast("Task updated successfully");
    setEditingTask(null);
    reset();
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast("Task deleted successfully");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Task</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Task</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(addTask)} className="space-y-4">
              <div>
                <label htmlFor="title">Task Title</label>
                <Input id="title" {...register("title")} />
                {errors.title && <p className="text-red-500">{errors.title.message}</p>}
              </div>
              <div>
                <label htmlFor="description">Description</label>
                <Textarea id="description" {...register("description")} />
              </div>
              <div>
                <label htmlFor="dueDate">Due Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Input id="dueDate" {...register("dueDate")} />
                  </PopoverTrigger>
                  <PopoverContent>
                    <Calendar
                      mode="single"
                      selected={new Date()}
                      onSelect={(date) => setValue("dueDate", date)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label htmlFor="priority">Priority</label>
                <select id="priority" {...register("priority")}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <Button type="submit">Save</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-4">
        {tasks.map(task => (
          <div key={task.id} className="p-4 border rounded-lg flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">{task.title}</h2>
              <p>{task.description}</p>
              <p>{task.dueDate ? format(new Date(task.dueDate), "PPP") : "No due date"}</p>
              <p>Priority: {task.priority || "None"}</p>
            </div>
            <div className="space-x-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingTask(task)}>Edit</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Task</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit(editTask)} className="space-y-4">
                    <div>
                      <label htmlFor="title">Task Title</label>
                      <Input id="title" defaultValue={task.title} {...register("title")} />
                      {errors.title && <p className="text-red-500">{errors.title.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="description">Description</label>
                      <Textarea id="description" defaultValue={task.description} {...register("description")} />
                    </div>
                    <div>
                      <label htmlFor="dueDate">Due Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Input id="dueDate" defaultValue={task.dueDate} {...register("dueDate")} />
                        </PopoverTrigger>
                        <PopoverContent>
                          <Calendar
                            mode="single"
                            selected={new Date(task.dueDate)}
                            onSelect={(date) => setValue("dueDate", date)}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <label htmlFor="priority">Priority</label>
                      <select id="priority" defaultValue={task.priority} {...register("priority")}>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                    <Button type="submit">Save</Button>
                  </form>
                </DialogContent>
              </Dialog>
              <Button variant="destructive" onClick={() => deleteTask(task.id)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;