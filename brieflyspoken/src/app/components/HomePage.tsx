"use client";

import { DataGrid } from '@mui/x-data-grid';
import { useRouter } from 'next/navigation';
import './HomePage.css'

const columns: any[] = [
    { field: 'id', headerName: 'ID', width: 90,  },
    {
        field: 'originalText',
        headerName: 'Original Text',
        flex: 1
    },
    {
        field: 'content',
        headerName: 'Content',
        flex: 1, 
    },
    {
        field: 'isCustomVoice',
        headerName: 'Custom Voice',
        width: 100, 
    },
    {
        field: 'isTwo',
        headerName: 'Podcast?',
        width: 100, 
    }

];

const HomePage = ({ entries }: any) => {

    const router = useRouter()

    return (
        <section style={{ width: '100%' }}>
            <DataGrid 
                columns={columns} 
                rows={entries.map((entry: any) => ({
                    ...entry,
                    ...Object.fromEntries(
                      Object.entries(entry).map(([key, value]) => [
                        key,
                        typeof value === 'boolean' ? (value ? '✓' : '✗') : value,
                      ])
                    ),
                  }))} 
                onRowClick={(row) => {
                    router.push(`/examples/${row.id}`)
                }}
                sx={{
                    boxShadow: 2,
                    border: 2,
                    borderColor: 'var(--color-primary)',
                }}
                disableColumnSorting
            />
        </section>
    )
}

export default HomePage