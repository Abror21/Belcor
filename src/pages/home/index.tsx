import React, { ReactNode, useState } from 'react';
import Box from '@mui/material/Box';
import app from '../../firebaseConfig';
import { getDatabase, ref, get } from 'firebase/database';
import { Button, CircularProgress, IconButton, Snackbar } from '@mui/material';
import Modal from '../../components/modal';
import SubmitForm from './components/submit-form';
import Table from '../../components/table';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

// interface Data {
//     delivered: string;
//     description: string;
//     id: string;
//     name: string;
//     orderData: string;
//     price: string;
//     type: string;
//     weight: string;
// }
export interface HeadCell {
    id: string;
    label: string;
    render?: (param?: any) => ReactNode;
}
export type DynamicObject = {
    [key: string]: any;
};

export default function Home() {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [snackMessage, setSnackMessage] = React.useState<string>('');
    const [isSnackOpen, setIsSnackOpen] = useState<boolean>(false);
    const [loading, setloading] = useState(false);
    const [orders, setOrders] = useState<any>([]);
    const [open, setOpen] = useState(false);

    const fetchOrders = async () => {
        setloading(true);
        const db = getDatabase(app);
        const dbRef = ref(db, 'orders');
        const snapshot = await get(dbRef);
        setloading(false);
        if (snapshot.exists()) {
            const data = snapshot.val();
            const tempArr = Object.keys(data).map(id => ({ ...data[id], id }));
            setOrders(tempArr);
        } else {
            console.log('snapshot error');
            setIsSnackOpen(true);
            setSnackMessage('Something went wrong');
        }
    }
    // console.log('orders: ', orders);

    React.useEffect(() => {
        fetchOrders();
    }, [])

    const columns: HeadCell[] = [
        {
            id: 'icon',
            label: '',
            render: (param) => (
                <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => setOpen(!open)}
                >
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
            )
        },
        {
            id: 'name',
            label: 'Title',
        },
        {
            id: 'price',
            label: "Price (So'm)",
        },
        {
            id: 'type',
            label: 'Type',
        },
        {
            id: 'weight',
            label: "Weight (kg)",
        },
        {
            id: 'orderDate',
            label: 'Order date',
        },
        {
            id: 'delivered',
            label: 'Delivery status',
        },
    ];

    const vertical = 'top';
    const horizontal = 'center';

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ m: 1, position: 'relative', width: 'fit-content', marginLeft: 'auto' }}>
                <Button
                    sx={{
                        marginBottom: '15px'
                    }}
                    type='button'
                    variant="contained"
                    color="success"
                    disabled={loading}
                    onClick={() => setIsModalOpen(true)}
                >
                    Add Order
                </Button>
                {loading && (
                    <CircularProgress
                        size={24}
                        sx={{
                            color: 'green',
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            marginTop: '-12px',
                            marginLeft: '-12px',
                        }}
                    />
                )}
            </Box>
            <Table
                loading={loading}
                pagination={true}
                paginationPerPageOptions={[5, 10, 15, 20]}
                headCells={columns}
                data={orders}
            />
            <Modal
                isOpen={isModalOpen}
                closeModal={setIsModalOpen}
            >
                <SubmitForm
                    loading={loading}
                    closeModal={setIsModalOpen}
                    snackMessage={setSnackMessage}
                    openSnack={setIsSnackOpen}
                    fetchOrders={fetchOrders}
                    setloading={setloading}
                />
            </Modal>
            <Snackbar
                anchorOrigin={{ vertical, horizontal }}
                open={isSnackOpen}
                onClose={() => setIsSnackOpen(false)}
                message={snackMessage}
                key={'top' + 'center'}
            />
        </Box>
    );
}