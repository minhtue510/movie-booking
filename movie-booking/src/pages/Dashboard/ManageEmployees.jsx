import React, { useEffect, useState } from "react";
import { getEmployees } from "../../services/getEmployees";
import { updateInfo, uploadImage } from "../../services/editUser";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { EditOutlined, DeleteOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Table, Avatar, Modal, Button, Upload, message } from "antd";

const ManageEmployees = () => {
    const [employees, setEmployees] = useState([]);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [editedData, setEditedData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [uploading, setUploading] = useState(false);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    const uploadButton = (
        <div>
            {uploading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await getEmployees();
                const filtered = (response.data || []).filter(emp => emp.roles?.includes("Staff"));
                setEmployees(filtered);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách nhân viên:", error);
            }
        };
        fetchEmployees();
    }, []);

    const openEditModal = (employee) => {
        setEditingEmployee(employee);
        setEditedData({
            fullName: employee.fullName || "",
            phoneNumber: employee.phoneNumber || "",
            avatarUrl: employee.avatarUrl || "",
        });
        setEditModalVisible(true);
    };

    const handleSave = async () => {
        if (!/^\d{10}$/.test(editedData.phoneNumber)) {
            setErrorMessage("Số điện thoại phải gồm đúng 10 số.");
            return;
        }

        setIsLoading(true);
        setErrorMessage("");
        try {
            const updatedData = {
                fullName: editedData.fullName,
                phoneNumber: editedData.phoneNumber,
                avatarUrl: editedData.avatarUrl,
            };
            await updateInfo(editingEmployee.userId, updatedData);
            const updatedList = employees.map(emp =>
                emp.userId === editingEmployee.userId ? { ...emp, ...updatedData } : emp
            );
            setEmployees(updatedList);
            setEditModalVisible(false);
            setSuccessMessage("Cập nhật thành công");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (error) {
            setErrorMessage("Cập nhật thất bại. Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    };

    const columns = [
        {
            title: "Avatar",
            dataIndex: "avatarUrl",
            key: "avatarUrl",
            align: "center",
            render: (avatar) => (
                <Avatar src={avatar || "https://via.placeholder.com/40"} />
            ),
        },
        {
            title: "Tên đăng nhập",
            dataIndex: "userName",
            key: "userName",
        },
        {
            title: "Họ và tên",
            dataIndex: "fullName",
            key: "fullName",
            render: (text) => text || "(Chưa có)",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Số điện thoại",
            dataIndex: "phoneNumber",
            key: "phoneNumber",
            render: (text) => text || "(Chưa có)",
        },
        {
            title: "Hành động",
            key: "action",
            align: "center",
            render: (_, record) => (
                <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                    <EditOutlined
                        style={{ color: "blue", cursor: "pointer" }}
                        onClick={() => openEditModal(record)}
                    />
                    <DeleteOutlined
                        style={{ color: "red", cursor: "pointer" }}
                        onClick={() => console.log("Delete chưa xử lý")}
                    />
                </div>
            ),
        },
    ];

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-800">Danh sách nhân viên</h1>
                <Button type="primary" onClick={() => openAddModal()}>
                    Thêm nhân viên
                </Button>
            </div>
            <Table
                dataSource={employees}
                columns={columns}
                rowKey="userId"
                pagination={{ pageSize: 5 }}
                bordered
            />

            <Modal
                title="Chỉnh sửa thông tin nhân viên"
                open={editModalVisible}
                onCancel={() => setEditModalVisible(false)}
                onOk={handleSave}
                okText="Lưu"
                confirmLoading={isLoading}
            >
                {editingEmployee && (
                    <div className="space-y-3">
                        <div className="text-center">
                            {/* <Avatar size={64} src={editedData.avatarUrl || "https://via.placeholder.com/64"} /> */}
                            <div>
                                <Upload
                                    name="avatar"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    showUploadList={false}
                                    accept="image/*"
                                    beforeUpload={async (file) => {
                                        setUploading(true);
                                        try {
                                            const response = await uploadImage(file);
                                            setEditedData((prev) => ({
                                                ...prev,
                                                avatarUrl: response.avatarUrl,
                                            }));

                                            message.success("Tải ảnh lên thành công!");
                                        } catch (error) {
                                            console.error("Upload failed:", error);
                                            message.error("Không thể tải ảnh lên.");
                                        } finally {
                                            setUploading(false);
                                        }

                                        return false;
                                    }}
                                >
                                    {editedData.avatarUrl ? (
                                        <img
                                            src={editedData.avatarUrl}
                                            alt="avatar"
                                            style={{ width: "100%" }}
                                        />
                                    ) : (
                                        uploadButton
                                    )}
                                </Upload>

                            </div>
                        </div>

                        <div>
                            <label className="font-semibold">Họ và tên:</label>
                            <input
                                className="w-full border px-2 py-1 rounded"
                                value={editedData.fullName}
                                onChange={(e) =>
                                    setEditedData({ ...editedData, fullName: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <label className="font-semibold">Số điện thoại:</label>
                            <input
                                className="w-full border px-2 py-1 rounded"
                                value={editedData.phoneNumber}
                                onChange={(e) =>
                                    setEditedData({ ...editedData, phoneNumber: e.target.value })
                                }
                            />
                        </div>

                        {errorMessage && (
                            <div className="text-red-600 font-semibold">{errorMessage}</div>
                        )}
                        {successMessage && (
                            <div className="text-green-600 font-semibold">{successMessage}</div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ManageEmployees;
