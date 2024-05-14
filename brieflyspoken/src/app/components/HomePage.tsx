"use client";

import { DataGrid } from '@mui/x-data-grid';
import { useRouter } from 'next/navigation';

const columns: any[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
        field: 'content',
        headerName: 'Content',
    },

];

const HomePage = ({ entries }: any) => {

    const router = useRouter()

    return (
        <div>
            <DataGrid columns={columns} rows={entries} onRowClick={(row) => {
                router.push(`/examples/${row.id}`)
            }} />
        </div>
    )
}

export default HomePage