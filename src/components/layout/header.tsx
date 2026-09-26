import { LucideIcon, Plus } from "lucide-react";

interface HeaderProps {
    icon: LucideIcon;
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
                <div className="flex items-center gap-2">
                    <div className="flex size-7 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-pink-50 sm:size-8">
                        <Icon size={13} strokeWidth={2} className="text-blue-500 sm:hidden" />
                        <Icon size={15} strokeWidth={2} className="hidden text-blue-500 sm:block" />
                    </div>

                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-300">
                        Together
                    </p>
                </div>

                <h1 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-neutral-800 sm:mt-4 sm:text-3xl lg:text-4xl capitalize">
                    {title}
                </h1>

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