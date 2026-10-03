import { LucideIcon, Plus } from "lucide-react";

interface HeaderProps {
    icon?: LucideIcon;
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

const Header = ({ icon: Icon, title, description, action }: HeaderProps) => {
    return (
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
            <div>
                <div className="flex items-center gap-x-2">
                    {Icon && <Icon size={20} className="text-black" />}

                    <h1 className="text-2xl font-semibold tracking-[-0.04em] text-neutral-800 sm:text-3xl lg:text-4xl capitalize">
                        {title}
                    </h1>
                </div>

                <p className="mt-2 max-w-md text-[13px] leading-6 text-neutral-400 sm:text-sm">
                    {description}
                </p>
            </div>

            {action && (
                <button
                    type="button"
                    onClick={action.onClick}
                    className="group flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-neutral-900 px-5 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(0,0,0,0.4)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-neutral-800 active:translate-y-0 sm:w-auto"
                >
                    <Plus size={16} strokeWidth={2.4} className="transition-transform duration-200 group-hover:rotate-90" />
                    {action.label}
                </button>
            )}
        </div>
    );
};

export default Header;