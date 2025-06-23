type PreferenceButtonProps = {
    onClick: () => void;
    label: string;
    icon: any;
    active: boolean;
}
export const PreferenceButton = (props: PreferenceButtonProps) => {
    return (
        <button onMouseDown={() => props.onClick()} class={`flex flex-row items-center gap-2 w-full px-4 py-2 rounded-lg ${props.active ? 'bg-blue-700 text-white' : ''}`}>
            <span class="h-[25px] w-[25px] flex justify-center items-center rounded-lg shadow-lg bg-black">{props.icon}</span>
            {props.label}
        </button>
    );
}
