import React, { Dispatch, SetStateAction } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { StyledForm } from './style';
import { Box, Button, Checkbox, CircularProgress, FormControl, FormControlLabel, InputLabel, MenuItem, Select, SnackbarOrigin, TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import app from '../../../../firebaseConfig';
import { getDatabase, ref, set, push, get } from 'firebase/database';

interface InputProps {
    name: string;
    price: number | null;
    type: string;
    weight: number | null;
    orderDate: Dayjs | null;
    delivered: boolean;
    description: string;
}

interface SubmitFormProps {
    loading: boolean;
    closeModal: Dispatch<SetStateAction<boolean>>;
    snackMessage: Dispatch<SetStateAction<string>>;
    openSnack: Dispatch<SetStateAction<boolean>>;
    fetchOrders: Function;
    setloading: Dispatch<SetStateAction<boolean>>;
}

const SubmitForm = ({ loading, closeModal, snackMessage, openSnack, fetchOrders, setloading }: SubmitFormProps) => {

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        control,
        formState: { errors },
        reset
    } = useForm<InputProps>({
        defaultValues: {
            name: '',
            price: null,
            type: '',
            weight: null,
            orderDate: '',
            delivered: false,
            description: ''
        }
    });

    const postData = (data: InputProps) => {
        setloading(true);
        const db = getDatabase(app);
        const newDocRef = push(ref(db, "orders"));
        set(newDocRef, {
            name: data.name,
            price: data.price,
            type: data.type,
            weight: data.weight,
            orderDate: dayjs(data.orderDate).format('DD.MM.YYYY'),
            delivered: data.delivered ? 'Delivered' : 'Not delivered',
            description: data.description
        })
            .then(res => {
                snackMessage('Added successfully');
                closeModal(false);
                openSnack(true);
                reset();
                fetchOrders();
            })
            .catch(err => {
                snackMessage('Something went wrong(');
                openSnack(true);
            })
            .finally(() => setloading(false))
    }

    return (
        <StyledForm>
            <Box
                component="form"
                onSubmit={handleSubmit((data) => postData(data))}
            >
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                    <TextField
                        error={!!errors.name}
                        id="name"
                        label="Name"
                        variant="outlined"
                        {...register("name", { required: true, maxLength: 10 })}
                    />
                    <TextField
                        error={!!errors.price}
                        id="price"
                        label="Price (so'm)"
                        variant="outlined"
                        type='number'
                        {...register("price", { required: true })}
                    />
                    <FormControl
                        sx={{ minWidth: '100px' }}
                        error={!!errors.type}
                        {...register("type", { required: true })}
                    >
                        <InputLabel id="type">Type</InputLabel>
                        <Select
                            labelId="type"
                            id="type"
                            label="Type"
                            value={watch("type") || ""}
                            onChange={(e) => setValue("type", e.target.value)}
                        >
                            <MenuItem value="consuming">Consuming</MenuItem>
                            <MenuItem value="not consuming">Not consuming</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        error={!!errors.weight}
                        id="weight"
                        label="Weight (gr)"
                        variant="outlined"
                        type='number'
                        {...register("weight", { required: true, maxLength: 10 })}
                    />
                    <Controller
                        name="orderDate"
                        control={control}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Order Date"
                                    value={value || null}
                                    onChange={value => onChange(value)}
                                />
                            </LocalizationProvider>
                        )}
                    />
                    <FormControlLabel
                        control={<Checkbox />}
                        label="Delivered"
                        {...register("delivered", { maxLength: 1000 })}
                    />
                    <TextField
                        {...register("description", { maxLength: 1000 })}
                        id="description"
                        label="Description"
                        multiline
                        fullWidth
                        rows={2}
                    />
                </Box>
                <Box
                    sx={{
                        marginTop: '30px',
                        display: 'flex',
                        gap: '15px',
                        justifyContent: 'flex-end'
                    }}
                >
                    <Button
                        type='button'
                        variant='outlined'
                        onClick={() => closeModal(false)}
                    >
                        Cancel
                    </Button>

                    <Box sx={{ m: 1, position: 'relative', width: 'fit-content' }}>
                        <Button
                            type='submit'
                            variant='contained'
                            color='success'
                        >
                            Submit
                        </Button>
                        {loading && (
                            <CircularProgress
                                size={24}
                                sx={{
                                    color: 'black',
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    marginTop: '-12px',
                                    marginLeft: '-12px',
                                }}
                            />
                        )}
                    </Box>
                </Box>
            </Box>
        </StyledForm>
    )
}

export default SubmitForm