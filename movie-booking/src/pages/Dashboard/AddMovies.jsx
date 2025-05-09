import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, InputNumber, Select, DatePicker } from "antd";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/SideBar/SideBar";
import { getGenres } from "../../services/getGenres";
import { getAgeRatings } from "../../services/getAgeRating";
const AddMovies = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [collapsed, setCollapsed] = useState(false);
    const [genres, setGenres] = useState([]);
    const [ageRatings, setAgeRatings] = useState([]);
    useEffect(() => {
        const fetchAgeRatings = async () => {
            try {
                const data = await getAgeRatings();
                setAgeRatings(data);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách giới hạn độ tuổi:", error);
                message.error("Không thể tải danh sách giới hạn độ tuổi!");
            }
        };

        fetchAgeRatings();
    }, []);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await getGenres();
                const genresData = response.data || [];
                setGenres(genresData);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách thể loại:", error);
                message.error("Không thể tải danh sách thể loại!");
            }
        };

        fetchGenres();
    }, []);

    const handleSubmit = (values) => {
        console.log("Dữ liệu thêm mới:", values);
        message.success("Thêm phim mới thành công!");
        navigate("/dashboard");
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <div className={`transition-all duration-300 ${collapsed ? "w-[80px]" : "w-[250px]"} bg-white shadow`}>
                <Sidebar
                    activeSection="movies"
                    setActiveSection={() => navigate("/dashboard")}
                    onToggle={(collapsed) => setCollapsed(collapsed)}
                />
            </div>

            <div className="flex-1 p-6">
                <h1 className="text-2xl font-bold mb-4">Thêm phim mới</h1>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{ title: "", genres: [], nation: "", rating: "" }}
                >
                    <Form.Item
                        label="Tên phim"
                        name="title"
                        rules={[{ required: true, message: "Vui lòng nhập tên phim!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Trạng thái"
                        name="status"
                        rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
                    >
                        <Select>
                            <Select.Option value="PLAYING">Đang chiếu</Select.Option>
                            <Select.Option value="UPCOMING">Sắp chiếu</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Đánh giá"
                        name="rating"
                        rules={[
                            { required: true, message: "Vui lòng nhập đánh giá!" },
                            {
                                type: "number",
                                min: 0,
                                max: 10,
                                message: "Đánh giá phải nằm trong khoảng từ 0 đến 10!",
                            },
                        ]}
                    >
                        <InputNumber
                            min={0}
                            max={10}
                            step={0.1}
                            style={{ width: "100%" }}
                            placeholder="Nhập đánh giá"
                        />
                    </Form.Item>
                    <Form.Item
                        label="Thời lượng (phút)"
                        name="duration"
                        rules={[{ required: true, message: "Vui lòng nhập thời lượng!" }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item
                        label="Quốc gia"
                        name="nation"
                        rules={[{ required: true, message: "Vui lòng nhập quốc gia!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Ngày phát hành"
                        name="releaseDate"
                        rules={[{ required: true, message: "Vui lòng chọn ngày phát hành!" }]}
                    >
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                        label="Giới hạn độ tuổi"
                        name="ageRating"
                        rules={[{ required: true, message: "Vui lòng chọn giới hạn độ tuổi!" }]}
                    >
                        <Select placeholder="Chọn giới hạn độ tuổi">
                            {ageRatings.map((rating) => (
                                <Select.Option key={rating.id} value={rating.id}>
                                    {rating.ratingLabel} - {rating.description}
                                </Select.Option>
                            ))}
                        </Select>

                    </Form.Item>
                    <Form.Item
                        label="Thể loại"
                        name="genres"
                        rules={[{ required: true, message: "Vui lòng chọn thể loại!" }]}
                    >
                        <Select
                            mode="multiple"
                            placeholder="Chọn thể loại"
                            style={{ width: "100%" }}
                            value={form.getFieldValue("genres") || []}
                        >
                            {genres.map((genre) => (
                                <Select.Option key={genre.id} value={genre.genreName}>
                                    {genre.genreName}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Mô tả"
                        name="description"
                        rules={[{ required: false, message: "Vui lòng nhập mô tả!" }]}
                    >
                        <Input.TextArea rows={4} placeholder="Nhập mô tả" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Thêm phim
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default AddMovies;
