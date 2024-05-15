"use client";

import { DataGrid } from '@mui/x-data-grid';
import { CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import './HomePage.css'
import { useState, Fragment } from 'react';

const columns: any[] = [
    { field: 'id', headerName: 'ID', width: 90, },
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

    const [isLoading, setIsLoading] = useState(false)

    const router = useRouter()

    if (isLoading) return (<Fragment>
        <svg width={0} height={0}>
            <defs>
                <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgb(178, 224, 200)" />
                    <stop offset="100%" stopColor="rgb(255, 130, 0)" />
                </linearGradient>
            </defs>
        </svg>
        <CircularProgress size={100} sx={{ 'svg circle': { stroke: 'url(#my_gradient)' }, position: "absolute", top: "calc(50vh - 50px)" }} />
    </Fragment>)

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
                    setIsLoading(true)
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