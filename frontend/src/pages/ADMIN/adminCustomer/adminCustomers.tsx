import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import {
    fetchCustomers,
    deleteCustomer,
    createUser,
    showAdminForm,
    hideAdminForm,
    updateUserInputs,
    resetUserInputs
} from "../../../features/customerSlice";
import { Text } from "../../../components/Text/text";
import style from "./adminCustomers.module.css";
import { Button } from "../../../components/button/button";

export const AdminCustomers = () => {
    const dispatch = useDispatch<AppDispatch>();

    const {
        customers,
        loading,
        error,
        showAdminForm: isFormVisible,
        inputs
    } = useSelector((state: RootState) => state.customers);

    useEffect(() => {
        dispatch(fetchCustomers());
    }, [dispatch]);

    const handleCreateUser = async () => {
        if (!inputs.name || !inputs.email || !inputs.password) {
            return;
        }

        const result = await dispatch(createUser(inputs));

        if (createUser.fulfilled.match(result)) {
            dispatch(hideAdminForm());
            dispatch(resetUserInputs());
        }
    };

    return (
        <div className={style.customersPage}>
            <div className={style.pageHeader}>
                <div>
                    <Text variant="h1">Manage Customers</Text>
                    <Text variant="p">
                        Manage customer accounts and administrators.
                    </Text>
                </div>

                <Button
                    type="button"
                    label="Add User"
                    onClick={() => dispatch(showAdminForm())}
                />
            </div>

            {isFormVisible && (
                <div className={style.formContainer}>
                    <Text variant="h2">Add New User</Text>

                    <label>
                        Full Name
                        <input
                            type="text"
                            value={inputs.name}
                            onChange={(event) =>
                                dispatch(updateUserInputs({
                                    name: event.target.value
                                }))
                            }
                            placeholder="Enter full name"
                        />
                    </label>

                    <label>
                        Email
                        <input
                            type="email"
                            value={inputs.email}
                            onChange={(event) =>
                                dispatch(updateUserInputs({
                                    email: event.target.value
                                }))
                            }
                            placeholder="Enter email address"
                        />
                    </label>

                    <label>
                        Password
                        <input
                            type="password"
                            value={inputs.password}
                            onChange={(event) =>
                                dispatch(updateUserInputs({
                                    password: event.target.value
                                }))
                            }
                            placeholder="Enter password"
                        />
                    </label>

                    <label>
                        Role
                        <select
                            value={inputs.role}
                            onChange={(event) =>
                                dispatch(updateUserInputs({
                                    role: event.target.value as "customer" | "admin"
                                }))
                            }
                        >
                            <option value="customer">Customer</option>
                            <option value="admin">Admin</option>
                        </select>
                    </label>

                    <div className={style.formActions}>
                        <Button
                            type="button"
                            label="Cancel"
                            onClick={() => {
                                dispatch(hideAdminForm());
                                dispatch(resetUserInputs());
                            }}
                        />

                        <Button
                            type="button"
                            label="Create User"
                            onClick={handleCreateUser}
                        />
                    </div>
                </div>
            )}

            {loading && (
                <Text variant="p">Loading customers...</Text>
            )}

            {error && (
                <Text variant="p">{error}</Text>
            )}

            {!loading && !error && (
                <>
                    <div className={style.tableContainer}>
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
                                        <td>
                                            <span className={`${style.role} ${customer.role === "admin" ? style.admin : style.customer}`}>
                                                {customer.role}
                                            </span>
                                        </td>
                                        <td>
                                            {new Date(customer.created_at).toLocaleDateString("en-ZA")}
                                        </td>
                                        <td>
                                            <Button
                                                type="button"
                                                label="Delete"
                                                onClick={() => {
                                                    const confirmed = window.confirm(
                                                        `Are you sure you want to delete ${customer.name}?`
                                                    );

                                                    if (confirmed) {
                                                        dispatch(deleteCustomer(customer.id));
                                                    }
                                                }}
                                            />
                                        </td>
                                    </tr>
                                ))}

                                {customers.length === 0 && (
                                    <tr>
                                        <td colSpan={5}>
                                            No customers found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <Text variant="p">
                        Total customers: {customers.length}
                    </Text>
                </>
            )}
        </div>
    );
};
