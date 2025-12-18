const Skeleton = ({ className }) => (
    <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`}></div>
);

export const CardSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-premium p-4 md:p-6 flex flex-col h-full border border-gray-100/50">
        <Skeleton className="w-full aspect-[4/3] rounded-xl mb-4" />
        <Skeleton className="h-6 w-3/4 mb-3" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mb-6" />
        <div className="mt-auto flex items-center justify-between">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-10 w-10 rounded-full" />
        </div>
    </div>
);

export const StatSkeleton = () => (
    <div className="bg-white p-6 rounded-2xl shadow-premium border border-gray-100">
        <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-10 rounded-xl" />
        </div>
        <Skeleton className="h-8 w-24 mb-1" />
        <Skeleton className="h-3 w-32" />
    </div>
);

export const TableRowSkeleton = ({ cols = 5 }) => (
    <tr>
        {Array(cols).fill(0).map((_, i) => (
            <td key={i} className="px-6 py-4">
                <Skeleton className="h-4 w-full" />
            </td>
        ))}
    </tr>
);

export default Skeleton;
