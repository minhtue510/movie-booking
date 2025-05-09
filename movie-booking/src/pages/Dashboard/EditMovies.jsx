import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Input, Button, message, Select, DatePicker, Upload, Modal, InputNumber } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { getMovieDetail, updateMovie } from "../../services/getMovies";
import { getGenres } from "../../services/getGenres";
import { getAgeRatings } from "../../services/getAgeRating";
import { getActors } from "../../services/getActors";
import Sidebar from "../../components/SideBar/SideBar";
import dayjs from "dayjs";
const { Option } = Select;

const EditMovies = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [genres, setGenres] = useState([]);
    const [ageRatings, setAgeRatings] = useState([]);
    const [actors, setActors] = useState([]);
    const queryParams = new URLSearchParams(location.search);
    const movieId = queryParams.get("id");
    const [image, setImage] = useState("");
    const [trailer, setTrailer] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
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

    useEffect(() => {
        const fetchMovie = async () => {
            setLoading(true);
            try {
                const [ageRatingsData, movie] = await Promise.all([getAgeRatings(), getMovieDetail(movieId)]);
                setAgeRatings(ageRatingsData);
                if (movie) {
                    const image = Array.isArray(movie.media)
                        ? movie.media.find((item) => item.mediaType === "Image")?.mediaURL || null
                        : null;
                    const trailer = Array.isArray(movie.media)
                        ? movie.media.find((item) => item.mediaType === "Video")?.mediaURL || null : null;
                    const ratingLabel = movie.ageRating.split(" - ")[0];
                    const ageRatingId = ageRatingsData.find((rating) => rating.ratingLabel === ratingLabel)?.id || null;
                    if (form) {
                        form.setFieldsValue({
                            ...movie,
                            releaseDate: movie.releaseDate ? dayjs(movie.releaseDate) : null,
                            status: movie.status,
                            rating: movie.rating,
                            description: movie.description,
                            actors: movie.actor,
                            genres: Array.isArray(movie.genres) ? movie.genres : [],
                            ageRating: ageRatingId,
                            trailer: trailer,
                            image: image,

                        });
                    }
                    setImage(image);
                    setTrailer(trailer);
                } else {
                    message.error("Không tìm thấy phim!");
                }
            } catch (error) {
                console.error("Lỗi khi lấy chi tiết phim:", error);
                message.error("Đã xảy ra lỗi!");
            } finally {
                setLoading(false);
            }
        };

        if (movieId) {
            fetchMovie();
        }
    }, [movieId, form]);

    useEffect(() => {
        const fetchActors = async () => {
            try {
                let allActors = [];
                let currentPage = 1;
                const pageSize = 100;

                while (true) {
                    const response = await getActors({ page: currentPage, pageSize });
                    allActors = [...allActors, ...response];
                    if (response.length < pageSize) break;
                    currentPage++;
                }

                setActors(allActors);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách diễn viên:", error);
                message.error("Không thể tải danh sách diễn viên!");
            }
        };

        fetchActors();
    }, []);

    const handleAddActor = (actor) => {
        const currentActors = form.getFieldValue("actors") || [];
        if (!currentActors.find((a) => a.id === actor.id)) {
            form.setFieldsValue({ actors: [...currentActors, actor] });
        }
    };

    const filteredActors = actors.filter((actor) =>
        actor.name.toLowerCase().includes(searchTerm.toLowerCase())
    );


    const handleSubmit = async (values) => {
        try {
            const ageRatingId = ageRatings.find((rating) => rating.id === values.ageRating)?.id || values.ageRating;
            const movieData = {
                title: values.title || "",
                description: values.description || "",
                status: values.status || "",
                nation: values.nation || "",
                duration: parseInt(values.duration, 10),
                ageRatingId: ageRatingId,
                rating: parseFloat(values.rating) || 0,
                releaseDate: values.releaseDate ? values.releaseDate.toISOString() : null,
                genreIds: genres
                    .filter((genre) => values.genres.includes(genre.genreName))
                    .map((genre) => genre.id),
                movieMedias: [
                    {
                        description: "Poster",
                        mediaType: "Image",
                        mediaURL: values.image || "",
                    },
                    {
                        description: "Trailer",
                        mediaType: "Video",
                        mediaURL: values.trailer || "",
                    },
                ],
            };
       
            await updateMovie(movieId, movieData);

            message.success("Cập nhật phim thành công!");
            window.location.reload();
        } catch (error) {
            message.error("Đã xảy ra lỗi khi cập nhật phim!");
        }
    };


    const handleImageChange = (e) => {
        setImage(e.target.value);
    };
    const handleTrailerChange = (e) => {
        const newTrailer = e.target.value;
        setTrailer(newTrailer);
        if (form) {
            form.setFieldsValue({ trailer: newTrailer });
        }
    };
    return (
        <div className="min-h-screen flex bg-gray-100">
            <Sidebar
                activeSection="movies"
                setActiveSection={() => navigate("/dashboard")}
                onToggle={(collapsed) => setCollapsed(collapsed)}
            />
            <div
                className="flex-1"
                style={{
                    marginLeft: collapsed ? "5rem" : "16rem",
                    transition: "margin-left 0.3s",
                }}
            >
                <div className="text-white p-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-black">Chỉnh sửa phim</h1>
                    <Button type="primary" htmlType="submit" form="edit-movie-form" >
                        Lưu
                    </Button>
                </div>

                <div className="p-6">
                    <Form
                        id="edit-movie-form"
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        initialValues={{
                            title: "",
                            genres: "",
                            nation: "",
                            rating: "",
                            status: "",
                            description: "",
                            duration: "",
                            releaseDate: null,
                            ageRating: "",
                            actor: "",
                            image: image || "",
                            trailer: trailer || "",
                        }}
                    >
                        <div className="grid grid-cols-3 ">
                            <div className="col-span-1 flex flex-col items-center">

                                <Form.Item>
                                    <div className="mb-4 w-full">
                                        {form.getFieldValue("image") && (
                                            <div className="text-center">
                                                <img
                                                    src={form.getFieldValue("image")}
                                                    alt="Poster phim"
                                                    className="w-100 h-150  rounded mb-2"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div className="mb-4 w-full flex justify-between items-center">
                                        <label className="block font-bold mr-4">Poster</label>
                                        <Upload
                                            name="image"
                                            listType="picture"
                                            showUploadList={false}
                                            beforeUpload={(file) => {
                                                const reader = new FileReader();
                                                reader.onload = (e) => {
                                                    const uploadedImage = e.target.result;
                                                    setImage(uploadedImage);
                                                    form.setFieldsValue({ image: uploadedImage });
                                                };
                                                reader.readAsDataURL(file);
                                                return false;
                                            }}
                                        >
                                            <Button className="items-right" icon={<UploadOutlined />}>Tải ảnh lên</Button>
                                        </Upload>
                                    </div>
                                    <input
                                        type="text"
                                        value={image || ""}
                                        onChange={handleImageChange}
                                        placeholder="Nhập link ảnh"
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                    />

                                    <div className="mb-6">
                                        <label className="block font-bold mb-2 mt-2">Trailer</label>
                                        <input
                                            type="text"
                                            value={trailer || ""}
                                            onChange={handleTrailerChange}
                                            placeholder="Nhập link trailer"
                                            className="w-full border border-gray-300 rounded px-3 py-2"
                                        />
                                        {trailer && (
                                            <div className="mt-2">
                                                <a
                                                    href={trailer}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-500 underline"
                                                >
                                                    Xem trailer
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </Form.Item>


                            </div>

                            <div className="col-span-2 grid grid-cols-1 ">
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
                                        <Option value="PLAYING">Đang chiếu</Option>
                                        <Option value="UPCOMING">Sắp chiếu</Option>
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
                                            <Option key={rating.id} value={rating.id}>
                                                {rating.ratingLabel} - {rating.description}
                                            </Option>
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
                                            <Option key={genre.id} value={genre.genreName}>
                                                {genre.genreName}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </div>
                        </div>

                        <Form.Item
                            label="Mô tả"
                            name="description"
                            rules={[{ required: false, message: "Vui lòng nhập mô tả!" }]}
                        >
                            <Input.TextArea rows={4} placeholder="Nhập mô tả" />
                        </Form.Item>

                        <Form.Item
                            name="actors"
                            rules={[{ required: false, message: "Vui lòng nhập diễn viên!" }]}
                        >
                            <div className="flex justify-between items-center">
                                <label className="block font-bold mb-2">Diễn viên</label>
                                <Button
                                    type="dashed"
                                    className="mt-4"
                                    onClick={() => setIsModalVisible(true)}
                                >
                                    Thêm diễn viên
                                </Button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
                                {form.getFieldValue("actors")?.map((actor) => (
                                    <div
                                        key={actor.id}
                                        className="flex flex-col items-center p-4  transition-shadow"
                                    >
                                        <img
                                            src={actor.image}
                                            alt={actor.name}
                                            className="w-20 h-20 object-cover rounded-full"
                                            style={{ border: "2px solid #ddd" }}
                                        />
                                        <p className="mt-3 font-semibold text-gray-800 text-center">{actor.name}</p>
                                        <p className="text-sm text-gray-500 italic text-center">{actor.role || "Chưa có vai trò"}</p>
                                    </div>
                                ))}
                            </div>

                        </Form.Item>
                        <Modal
                            title="Danh sách diễn viên"
                            open={isModalVisible}
                            onCancel={() => setIsModalVisible(false)}
                            footer={null}
                            width={900}
                            bodyStyle={{ padding: "20px" }}
                        >
                            <Input
                                placeholder="Tìm kiếm diễn viên..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="mb-4"
                                style={{ borderRadius: "8px", padding: "10px" }}
                            />
                            <div className="grid grid-cols-3 md:grid-cols-5 gap-6">
                                {filteredActors.map((actor) => (
                                    <div
                                        key={actor.id}
                                        className="flex flex-col items-center rounded-lg p-4 border border-gray-300 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                        onClick={() => {
                                            handleAddActor(actor);
                                            setIsModalVisible(false);
                                        }}
                                        style={{
                                            backgroundColor: "#f9f9f9",
                                            borderRadius: "10px",
                                        }}
                                    >
                                        <img
                                            src={actor.image}
                                            alt={actor.name}
                                            className="w-24 h-24 object-cover rounded-full"
                                            style={{ border: "2px solid #ddd" }}
                                        />
                                        <p className="mt-3 font-semibold text-gray-800 text-center">{actor.name}</p>
                                    </div>
                                ))}
                            </div>
                        </Modal>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default EditMovies;