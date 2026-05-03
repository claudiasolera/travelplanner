import { Toast } from './Toast';
import { useToast } from '../../hooks/useToast';

interface Props {
    toasts: ReturnType<typeof useToast>['toasts'];
    removeToast: (id: number) => void;
}

export const ToastContainer = ({ toasts, removeToast }: Props) => {
    if (toasts.length === 0) return null;
    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
            {toasts.map(t => (
                <Toast 
                    key={t.id} 
                    message={t.message} 
                    type={t.type} 
                    onClose={() => removeToast(t.id)} 
                />
            ))}
        </div>
    );
};