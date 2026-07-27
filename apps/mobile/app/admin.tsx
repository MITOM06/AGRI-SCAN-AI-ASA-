import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  LayoutDashboard,
  Users,
  LogOut,
  BarChart3,
  MessageSquare,
} from "lucide-react-native";

import { adminApi } from "@agri-scan/shared";

import { styles } from "../styles/admin.styles";
import { DashboardTab } from "../components/admin/DashboardTab";
import { UsersTab } from "../components/admin/UsersTab";
import { ReportTab } from "../components/admin/ReportTab";
import { FeedbackTab } from "../components/admin/FeedbackTab";
import type { TabType, FeedbackStatus } from "../components/admin/admin.types";

export default function AdminMobileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState<TabType>("DASHBOARD");
  const [errorMsg, setErrorMsg] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Thông tin Admin đăng nhập
  const [adminInfo, setAdminInfo] = useState<any>(null);

  // States: Dashboard
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);

  // States: Users
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersData, setUsersData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // States: Report
  const [loadingReport, setLoadingReport] = useState(false);
  const [reportData, setReportData] = useState<any>(null);

  // States: Feedback
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [feedbackStatus, setFeedbackStatus] =
    useState<FeedbackStatus>("PENDING");
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [pendingFeedbackCount, setPendingFeedbackCount] = useState(0);

  useEffect(() => {
    loadAdminProfile();
    fetchPendingFeedbackCount();
  }, []);

  useEffect(() => {
    setErrorMsg("");
    if (activeTab === "DASHBOARD" && !dashboardData) fetchDashboardData();
    else if (activeTab === "USERS" && usersData.length === 0) fetchUsersData();
    else if (activeTab === "REPORT" && !reportData) fetchReportData();
    else if (activeTab === "FEEDBACK") fetchFeedbacksData();
  }, [activeTab, feedbackStatus]);

  // Lấy thông tin Admin từ bộ nhớ máy
  const loadAdminProfile = async () => {
    try {
      let userStr = null;
      if (Platform.OS === "web") {
        userStr = localStorage.getItem("user");
      } else {
        userStr = await SecureStore.getItemAsync("user");
      }
      if (userStr) setAdminInfo(JSON.parse(userStr));
    } catch (e) {
      console.log("Không thể đọc thông tin admin");
    }
  };

  const fetchPendingFeedbackCount = async () => {
    try {
      const res = await adminApi.getFeedbacks("PENDING", 1, 1);
      setPendingFeedbackCount(res.pagination?.total || 0);
    } catch (error) {
      console.log("Lỗi lấy số đếm thông báo");
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoadingDashboard(true);
      const res = await adminApi.getDashboard();
      setDashboardData(res);
    } catch (error) {
      setErrorMsg("Không thể tải Tổng quan.");
    } finally {
      setLoadingDashboard(false);
    }
  };

  const fetchUsersData = async () => {
    try {
      setLoadingUsers(true);
      const res = await adminApi.getUsers({
        page: 1,
        limit: 50,
        search: searchQuery,
      });
      setUsersData(res.data);
    } catch (error) {
      setErrorMsg("Không thể tải danh sách Người dùng.");
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchReportData = async () => {
    try {
      setLoadingReport(true);
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), 0, 1)
        .toISOString()
        .split("T")[0];
      const today = now.toISOString().split("T")[0];

      const res = await adminApi.getRevenueReport({
        from: firstDay,
        to: today,
        groupBy: "month",
      });
      setReportData(res);
    } catch (error) {
      setErrorMsg("Không thể tải Báo cáo doanh thu.");
    } finally {
      setLoadingReport(false);
    }
  };

  const fetchFeedbacksData = async () => {
    try {
      setLoadingFeedback(true);
      const res = await adminApi.getFeedbacks(feedbackStatus, 1, 50);
      setFeedbacks(res.data);
    } catch (error) {
      setErrorMsg("Không thể tải danh sách Phản hồi.");
    } finally {
      setLoadingFeedback(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setErrorMsg("");
    try {
      fetchPendingFeedbackCount(); // Cập nhật lại số đếm luôn
      if (activeTab === "DASHBOARD") await fetchDashboardData();
      else if (activeTab === "USERS") await fetchUsersData();
      else if (activeTab === "REPORT") await fetchReportData();
      else if (activeTab === "FEEDBACK") await fetchFeedbacksData();
    } finally {
      setRefreshing(false);
    }
  };

  const handleReplySubmit = async (feedbackId: string) => {
    if (!replyContent.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập nội dung trả lời!");
      return;
    }
    try {
      setIsSubmittingReply(true);
      await adminApi.replyFeedback(feedbackId, replyContent);
      if (Platform.OS === "web") {
        window.alert("Đã gửi câu trả lời cho người dùng!");
      } else {
        Alert.alert("Thành công", "Đã gửi câu trả lời cho người dùng!");
      }
      setReplyContent("");
      setReplyingId(null);
      fetchFeedbacksData();
      fetchPendingFeedbackCount(); // Cập nhật lại số đếm sau khi trả lời
    } catch (error: any) {
      const msg = error.response?.data?.message || "Không thể gửi câu trả lời.";
      Platform.OS === "web" ? window.alert(msg) : Alert.alert("Lỗi", msg);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleLogout = async () => {
    if (Platform.OS === "web") {
      const confirmLogout = window.confirm(
        "Bạn có chắc chắn muốn đăng xuất khỏi quyền quản trị?",
      );
      if (confirmLogout) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        router.replace("/auth/login" as any);
      }
    } else {
      Alert.alert(
        "Đăng xuất",
        "Bạn có chắc chắn muốn đăng xuất khỏi quyền quản trị?",
        [
          { text: "Hủy", style: "cancel" },
          {
            text: "Đăng xuất",
            style: "destructive",
            onPress: async () => {
              await SecureStore.deleteItemAsync("accessToken");
              await SecureStore.deleteItemAsync("refreshToken");
              await SecureStore.deleteItemAsync("user");
              router.replace("/auth/login" as any);
            },
          },
        ],
      );
    }
  };


  // Lời chào theo thời gian thực
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Chào buổi sáng";
    if (hour < 18) return "Chào buổi chiều";
    return "Chào buổi tối";
  };

  return (
    <View style={styles.container}>
      {/* 🔥 MOBILE HEADER: THÔNG TIN ADMIN + NÚT ĐĂNG XUẤT */}
      <View
        style={[styles.headerMobile, { paddingTop: Math.max(insets.top, 16) }]}
      >
        <View style={styles.adminProfileRow}>
          <View style={styles.adminAvatar}>
            <Text style={styles.adminAvatarText}>
              {adminInfo?.fullName
                ? adminInfo.fullName.charAt(0).toUpperCase()
                : "A"}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.greetingText}>{getGreeting()},</Text>
            <Text style={styles.adminName} numberOfLines={1}>
              {adminInfo?.fullName || "Quản trị viên"}
            </Text>
            <Text style={styles.adminEmail} numberOfLines={1}>
              {adminInfo?.email || "admin@agri-scan.com"}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutBtnIcon} onPress={handleLogout}>
          <LogOut size={22} color="#ef4444" />
        </TouchableOpacity>
      </View>

      {/* 🔥 SCROLLVIEW VỚI PULL-TO-REFRESH */}
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#16a34a"]}
            tintColor="#16a34a"
          />
        }
      >
        {errorMsg ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        ) : null}

        {activeTab === "DASHBOARD" && (
          <DashboardTab
            loading={loadingDashboard}
            refreshing={refreshing}
            data={dashboardData}
          />
        )}
        {activeTab === "USERS" && (
          <UsersTab
            loading={loadingUsers}
            refreshing={refreshing}
            users={usersData}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            onSearch={fetchUsersData}
          />
        )}
        {activeTab === "REPORT" && (
          <ReportTab
            loading={loadingReport}
            refreshing={refreshing}
            data={reportData}
          />
        )}
        {activeTab === "FEEDBACK" && (
          <FeedbackTab
            loading={loadingFeedback}
            refreshing={refreshing}
            feedbacks={feedbacks}
            status={feedbackStatus}
            onStatusChange={setFeedbackStatus}
            replyingId={replyingId}
            onReplyingIdChange={setReplyingId}
            replyContent={replyContent}
            onReplyContentChange={setReplyContent}
            isSubmittingReply={isSubmittingReply}
            onSubmitReply={handleReplySubmit}
          />
        )}
      </ScrollView>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(insets.bottom, 12) },
        ]}
      >
        <TouchableOpacity
          style={styles.bottomTab}
          onPress={() => setActiveTab("DASHBOARD")}
        >
          <LayoutDashboard
            size={24}
            color={activeTab === "DASHBOARD" ? "#16a34a" : "#94a3b8"}
          />
          <Text
            style={[
              styles.bottomTabText,
              activeTab === "DASHBOARD" && styles.bottomTabTextActive,
            ]}
          >
            Tổng quan
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomTab}
          onPress={() => setActiveTab("USERS")}
        >
          <Users
            size={24}
            color={activeTab === "USERS" ? "#16a34a" : "#94a3b8"}
          />
          <Text
            style={[
              styles.bottomTabText,
              activeTab === "USERS" && styles.bottomTabTextActive,
            ]}
          >
            Tài khoản
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomTab}
          onPress={() => setActiveTab("REPORT")}
        >
          <BarChart3
            size={24}
            color={activeTab === "REPORT" ? "#16a34a" : "#94a3b8"}
          />
          <Text
            style={[
              styles.bottomTabText,
              activeTab === "REPORT" && styles.bottomTabTextActive,
            ]}
          >
            Báo cáo
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomTab}
          onPress={() => setActiveTab("FEEDBACK")}
        >
          <View style={{ position: "relative" }}>
            <MessageSquare
              size={24}
              color={activeTab === "FEEDBACK" ? "#16a34a" : "#94a3b8"}
            />
            {/* 🔥 HIỆN CHẤM ĐỎ THÔNG BÁO NẾU CÓ FEEDBACK CHỜ XỬ LÝ */}
            {pendingFeedbackCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationText}>
                  {pendingFeedbackCount > 99 ? "99+" : pendingFeedbackCount}
                </Text>
              </View>
            )}
          </View>
          <Text
            style={[
              styles.bottomTabText,
              activeTab === "FEEDBACK" && styles.bottomTabTextActive,
            ]}
          >
            Phản hồi
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
