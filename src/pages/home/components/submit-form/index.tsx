import React, { Dispatch, SetStateAction, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { StyledForm } from './style';
import { Box, Button, Checkbox, CircularProgress, FormControl, FormControlLabel, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import app from '../../../../firebaseConfig';
import { getDatabase, ref, set, push, get } from 'firebase/database';
import { InputProps } from '../..';

interface SubmitFormProps {
    loading: boolean;
    closeModal: Dispatch<SetStateAction<boolean>>;
    snackMessage: Dispatch<SetStateAction<string>>;
    openSnack: Dispatch<SetStateAction<boolean>>;
    fetchOrders: Function;
    setloading: Dispatch<SetStateAction<boolean>>;
    formValues?: InputProps | null;
}

const SubmitForm = ({ loading, closeModal, snackMessage, openSnack, fetchOrders, setloading, formValues }: SubmitFormProps) => {

    useEffect(() => {
        if (formValues) {
            setValue('name', formValues.name);
            setValue('price', formValues.price);
            setValue('type', formValues.type);
            setValue('weight', formValues.weight);
            setValue('orderDate', formValues.orderDate ? dayjs(formValues.orderDate, 'DD.MM.YYYY') : null);
            setValue('delivered', formValues.delivered == 'Delivered' ? true : false);
            setValue('description', formValues.description);
        }
    }, [formValues])

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

    const postOrder = (data: InputProps) => {
        setloading(true);
        const db = getDatabase(app);
        const newDocRef = push(ref(db, "orders"));
        set(newDocRef, {
            name: data.name,
            price: data.price,
            type: data.type,
            weight: data.weight,
            orderDate: data.orderDate ? dayjs(data.orderDate).format('DD.MM.YYYY') : null,
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
    const updateOrder = (data: InputProps, id: string) => {
        setloading(true);
        const db = getDatabase(app);
        const newOrderRef = ref(db, `orders/${id}`);
        set(newOrderRef, {
            name: data.name,
            price: data.price,
            type: data.type,
            weight: data.weight,
            orderDate: data.orderDate ? dayjs(data.orderDate).format('DD.MM.YYYY') : null,
            delivered: data.delivered ? 'Delivered' : 'Not delivered',
            description: data.description
        })
            .then(() => {
                closeModal(false);
                snackMessage('Updated successfully');
                openSnack(true);
                reset();
                fetchOrders();
            })
            .catch(() => {
                snackMessage('Something went wrong(');
                openSnack(true);
            })
            .finally(() => setloading(false))
    }

    return (
        <StyledForm>
            <Box
                component="form"
                onSubmit={handleSubmit((data) => {
                    if(formValues && formValues.id){
                        updateOrder(data, formValues.id);
                    }else{
                        postOrder(data);
                    }
                })}
            >
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                    <TextField
                        error={!!errors.name}
                        id="name"
                        label="Name"
                        variant="outlined"
                        {...register("name", { required: true, maxLength: 50 })}
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
                        <InputLabel id="type-label">Type</InputLabel>
                        <Controller
                            name='type'
                            control={control}
                            defaultValue=""
                            rules={{ required: true }}
                            render={({ field }) => (
                                <Select
                                    labelId="type-label"
                                    id="type"
                                    label="Type"
                                    {...field}
                                    value={field.value || ""}
                                    onChange={(e) => field.onChange(e.target.value)}
                                >
                                    <MenuItem value="consuming">Consuming</MenuItem>
                                    <MenuItem value="not consuming">Not consuming</MenuItem>
                                </Select>
                            )}
                        />
                    </FormControl>
                    <TextField
                        error={!!errors.weight}
                        id="weight"
                        label="Weight (gr)"
                        variant="outlined"
                        type='number'
                        {...register("weight", { required: true, maxLength: 50 })}
                    />
                    <Controller
                        name="orderDate"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    defaultValue={null}
                                    label="Order Date"
                                    value={value || null}
                                    onChange={value => onChange(value)}
                                />
                            </LocalizationProvider>
                        )}
                    />
                    <Controller
                        name="delivered"
                        control={control}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <FormControlLabel
                                control={
                                    <Checkbox checked={value as boolean} />
                                }
                                label="Delivered"
                                {...register("delivered")}
                            />
                        )}
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

                    <Box sx={{ position: 'relative', width: 'fit-content' }}>
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