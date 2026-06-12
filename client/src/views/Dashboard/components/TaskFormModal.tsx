import { useEffect, useState, type FormEvent } from 'react';
import { Alert, Button, InputField, SelectField } from '@/components/ui';
import type { Task, TaskFormValues } from '@/types';

interface TaskFormModalProps {
  open: boolean;
  task?: Task | null;
  saving: boolean;
  onClose: () => void;
  onSubmit: (values: TaskFormValues) => Promise<void> | void;
}

const initialValues: TaskFormValues = {
  title: '',
  description: '',
  status: 0,
  priority: 'medium',
  dueDate: ''
};

export const TaskFormModal = ({ open, task, saving, onClose, onSubmit }: TaskFormModalProps) => {
  const [values, setValues] = useState<TaskFormValues>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof TaskFormValues, string>>>({});

  useEffect(() => {
    if (task) {
      setValues({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : ''
      });
    } else {
      setValues(initialValues);
    }
    setErrors({});
  }, [task, open]);

  if (!open) {
    return null;
  }

  const validate = () => {
    const nextErrors: Partial<Record<keyof TaskFormValues, string>> = {};

    if (values.title.trim().length < 3) {
      nextErrors.title = 'Title must be at least 3 characters long';
    }

    if (values.description.length > 500) {
      nextErrors.description = 'Description must be at most 500 characters long';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    await onSubmit({
      ...values,
      title: values.title.trim(),
      description: values.description.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-slate-900 p-6 shadow-soft">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-brand-300">
              {task ? 'Update task' : 'Create task'}
            </p>
            <h2 className="text-2xl font-semibold text-white">
              {task ? 'Keep the board in sync' : 'Add a new task'}
            </h2>
          </div>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <InputField
            label="Title"
            value={values.title}
            onChange={(event) => setValues((current) => ({ ...current, title: event.target.value }))}
            error={errors.title}
            placeholder="Design the task API"
          />
          <InputField
            label="Description"
            textarea
            value={values.description}
            onChange={(event) => setValues((current) => ({ ...current, description: event.target.value }))}
            error={errors.description}
            placeholder="Add details, context, or acceptance criteria"
          />
          <div className="grid gap-4 md:grid-cols-3">
            <SelectField
              label="Status"
              value={String(values.status)}
              onValueChange={(nextValue) =>
                setValues((current) => ({ ...current, status: Number(nextValue) as TaskFormValues['status'] }))
              }
              options={[
                { value: '0', label: 'Pending' },
                { value: '1', label: 'In Progress' },
                { value: '2', label: 'Completed' }
              ]}
            />
            <SelectField
              label="Priority"
              value={values.priority}
              onValueChange={(nextValue) =>
                setValues((current) => ({ ...current, priority: nextValue as TaskFormValues['priority'] }))
              }
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' }
              ]}
            />
            <InputField
              label="Due date"
              type="date"
              value={values.dueDate}
              onChange={(event) => setValues((current) => ({ ...current, dueDate: event.target.value }))}
            />
          </div>
          {task ? <Alert message="Changes are saved directly to the live board." tone="info" /> : null}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{saving ? 'Saving...' : task ? 'Update task' : 'Create task'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
