import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { fetchCustomers } from "../../../features/customerSlice"
import { Text } from "../../../components/Text/text";
import style from "./adminCustomers.module.css";

export const AdminCustomers = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { customers, loading, error } = useSelector((state: RootState) => state.customers);

    useEffect(() => {
        dispatch(fetchCustomers());
    }, [dispatch]);

    return (
        <div className={style.customersPage}>
            <Text variant="h1">Manage Customers</Text>
            
            {loading && <Text variant="p">Loading customers...</Text>}

            {error && <Text variant="p">{error}</Text>}

            {!loading && !error && (
                <table className={style.customersTable}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Registered</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map((customer) => (
                            <tr key={customer.id}>
                                <td>{customer.name}</td>
                                <td>{customer.email}</td>
                                <td>{customer.role}</td>
                                <td>
                                    {new Date(customer.created_at).toLocaleDateString()}
                                </td>
                                <td>
                                    <button type="button">
                                        Update
                                    </button>
                                    <button type="button">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            

            {loading && <Text variant="p">Loading customers...</Text>}

            {error && <Text variant="p">{error}</Text>}

            {!loading && !error && (
                <Text variant="p">
                    Total customers: {customers.length}
                </Text>
            )}
        </div>
    );
};
