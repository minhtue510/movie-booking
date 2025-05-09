import React, { useEffect, useState } from "react";
import { getRevenue, getRevenueByMovie, getTotalAmount } from "../../services/getRevenue";
import { Card, Row, Col, Spin, Table, Statistic, Select, DatePicker, Button } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Column } from "@ant-design/plots";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const { Option } = Select;

const Revenue = () => {
  const [totalAmount, setTotalAmount] = useState(0);
  const [revenueData, setRevenueData] = useState([]);
  const [totalTicketsSold, setTotalTicketsSold] = useState(0);
  const [revenueByMovie, setRevenueByMovie] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [groupBy, setGroupBy] = useState("day");
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [todayDisplay, setTodayDisplay] = useState("");
  const getGroupByLabel = (key) => {
    switch (key) {
      case "day":
        return "ngày";
      case "month":
        return "tháng";
      case "year":
        return "năm";
      default:
        return key;
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {
        StartDate: startDate,
        EndDate: endDate,
        GroupBy: groupBy,
      };

      const total = await getTotalAmount();
      const revenue = await getRevenue(params);
      const revenueMovies = await getRevenueByMovie();

      setTotalAmount(total || 0);
      setRevenueData(
        (revenue?.data || []).map((item) => ({
          ...item,
          revenue: parseInt(item.revenue),
          formattedRevenue: `${parseInt(item.revenue).toLocaleString("vi-VN")} VNĐ`,
        }))
      );
      setRevenueByMovie(
        Array.isArray(revenueMovies?.data) ? revenueMovies.data : []
      );

      const totalTickets = revenueMovies?.data?.reduce(
        (sum, movie) => sum + (movie.ticketsSold || 0),
        0
      );
      setTotalTicketsSold(totalTickets || 0);
      const today = dayjs().format("YYYY-MM-DD");
      const todayRevenueRes = await getRevenue({
        StartDate: today,
        EndDate: today,
        GroupBy: "day",
      });
      const todayAmount = parseInt(todayRevenueRes?.data?.[0]?.revenue || 0);
      setTodayRevenue(todayAmount);
      setTodayDisplay(dayjs().format("DD/MM/YYYY")); // hiển thị ngày hôm nay dạng đẹp

    } catch (error) {
      console.error("Lỗi khi tải dữ liệu doanh thu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [groupBy, startDate, endDate]);

  const chartConfig = {
    data: revenueData,
    xField: "period",
    yField: "revenue",
    color: "#1979C9",
    columnWidthRatio: 0.8,
    barStyle: {
      radius: [4, 4, 0, 0],
    },
  };



  return (
    <div className="bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Thống kê doanh thu</h1>

      <div className="mb-6 text-center">
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Card>
              <h1 className="font-bold text-20">Doanh thu hôm nay</h1>
              <Statistic
                value={todayRevenue}
                valueStyle={{ color: "red" }}
                suffix="VNĐ"
                formatter={(value) => parseInt(value).toLocaleString("vi-VN")}
              />
            </Card>
          </Col>


          <Col span={8}>
            <Card>
            <h1 className="font-bold text-20">Tổng doanh thu</h1>
              <Statistic
                value={totalAmount}
                valueStyle={{ color: "#3f8600" }}
                suffix="VNĐ"
                formatter={(value) => value.toLocaleString()}
              />    
            </Card>
          </Col>
          <Col span={8}>
            <Card>
            <h1 className="font-bold text-20">Tổng vé đã bán</h1>
              <Statistic
                value={totalTicketsSold}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      <div className="bg-white p-6 mb-6 rounded-lg shadow-md">
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <label className="block text-gray-700 font-medium mb-2">Chọn khoảng thời gian</label>
            <RangePicker
              className="w-full"
              onChange={(dates) => {
                setStartDate(dates ? dates[0].format("YYYY-MM-DD") : null);
                setEndDate(dates ? dates[1].format("YYYY-MM-DD") : null);
              }}
            />
          </Col>
          <Col span={12}>
            <label className="block text-gray-700 font-medium mb-2">Hiển thị theo</label>
            <Select
              className="w-full"
              value={groupBy}
              onChange={(value) => setGroupBy(value)}
            >
              <Option value="day">Ngày</Option>
              <Option value="month">Tháng</Option>
              <Option value="year">Năm</Option>
            </Select>
          </Col>
        </Row>
        <div className="mt-4 text-right">
          <Button type="primary" onClick={fetchData}>
            Lấy dữ liệu
          </Button>
        </div>
      </div>

      {/* Biểu đồ */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card title={`Biểu đồ doanh thu theo ${getGroupByLabel(groupBy)}`}>
              <Column {...chartConfig} />
            </Card>
          </Col>
        </Row>
      )}

      <div className="mt-6">
        <Card title="Doanh thu theo phim">
          <Table
            dataSource={revenueByMovie}
            columns={[
              {
                title: "Tên phim",
                dataIndex: "title",
                key: "title",
              },
              {
                title: "Số vé đã bán",
                dataIndex: "ticketsSold",
                key: "ticketsSold",
              },
              {
                title: "Doanh thu (VNĐ)",
                dataIndex: "revenue",
                key: "revenue",
                render: (text) =>
                  `${parseInt(text).toLocaleString("vi-VN")}` || "0",
              },
            ]}
            rowKey="movieId"
            pagination={{ pageSize: 5 }}
          />
        </Card>
      </div>
    </div>
  );
};

export default Revenue;