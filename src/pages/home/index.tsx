import React, { ReactNode, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import app from '../../firebaseConfig';
import { getDatabase, ref, get, remove } from 'firebase/database';
import { Button, CircularProgress, IconButton, Snackbar } from '@mui/material';
import Modal from '../../components/modal';
import SubmitForm from './components/submit-form';
import Table from '../../components/table';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Dayjs } from 'dayjs';
import { useGetAllProductsQuery } from '../../API/productsSlice';

export interface HeadCell {
    id: string;
    label: string;
    info?: string;
    render?: (param?: any, call?: Function) => ReactNode;
}
export type DynamicObject = {
    [key: string]: any;
};
export interface InputProps {
    name: string;
    price: number | null;
    type: string;
    weight: number | null;
    orderDate: Dayjs | null;
    delivered: boolean | string;
    description: string;
    id?: string | undefined;
}

export default function Home() {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [snackMessage, setSnackMessage] = React.useState<string>('');
    const [isSnackOpen, setIsSnackOpen] = useState<boolean>(false);
    const [loading, setloading] = useState(false);
    const [orders, setOrders] = useState<any>([]);
    const [formValues, setFormValues] = useState<InputProps | null>(null);

    const { data, error, isLoading } = useGetAllProductsQuery('')
    console.log('products: ', data?.products);

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
    const removeOrder = async (id: string) => {
        const db = getDatabase(app);
        const dbRef = ref(db, `orders/${id}`);
        await remove(dbRef);
        fetchOrders();
    }

    useEffect(() => {
        fetchOrders();
    }, [])

    const columns: HeadCell[] = [
        {
            id: '',
            label: '',
            render: (param, call = () => { }) => (
                <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => call()}
                >
                    <KeyboardArrowDownIcon />
                </IconButton>
            ),
            info: 'description'
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
        {
            id: '',
            label: '',
            render: (param) => {
                return (
                    <Button
                        variant='outlined'
                        color='success'
                        onClick={() => {
                            setFormValues(param);
                            setIsModalOpen(true);
                        }}
                    >
                        Update
                    </Button>
                )
            }
        },
        {
            id: '',
            label: '',
            render: (param) => {
                return (
                    <Button
                        variant='outlined'
                        color='error'
                        onClick={() => removeOrder(param.id)}
                    >
                        Delete
                    </Button>
                )
            }
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
                    onClick={() => {
                        setFormValues(null);
                        setIsModalOpen(true);
                    }}
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
                columns={columns}
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
                    formValues={formValues}
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