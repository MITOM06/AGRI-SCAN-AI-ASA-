import React from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { CheckCircle2, Clock, MessageSquare, Send } from "lucide-react-native";

import { styles } from "../../styles/admin.styles";
import type { FeedbackStatus } from "./admin.types";

interface FeedbackTabProps {
  loading: boolean;
  refreshing: boolean;
  feedbacks: any[];
  status: FeedbackStatus;
  onStatusChange: (status: FeedbackStatus) => void;
  replyingId: string | null;
  onReplyingIdChange: (id: string | null) => void;
  replyContent: string;
  onReplyContentChange: (value: string) => void;
  isSubmittingReply: boolean;
  onSubmitReply: (feedbackId: string) => void;
}

export function FeedbackTab({
  loading,
  refreshing,
  feedbacks,
  status,
  onStatusChange,
  replyingId,
  onReplyingIdChange,
  replyContent,
  onReplyContentChange,
  isSubmittingReply,
  onSubmitReply,
}: FeedbackTabProps) {
  return (
    <View style={styles.tabContent}>
      <View style={styles.feedbackTabs}>
        <TouchableOpacity
          style={[
            styles.feedbackTabBtn,
            status === "PENDING" && styles.feedbackTabBtnActive,
          ]}
          onPress={() => onStatusChange("PENDING")}
        >
          <Clock size={16} color={status === "PENDING" ? "#fff" : "#64748b"} />
          <Text
            style={[
              styles.feedbackTabText,
              status === "PENDING" && { color: "#fff" },
            ]}
          >
            Chờ xử lý
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.feedbackTabBtn,
            status === "REPLIED" && styles.feedbackTabBtnActive,
          ]}
          onPress={() => onStatusChange("REPLIED")}
        >
          <CheckCircle2
            size={16}
            color={status === "REPLIED" ? "#fff" : "#64748b"}
          />
          <Text
            style={[
              styles.feedbackTabText,
              status === "REPLIED" && { color: "#fff" },
            ]}
          >
            Đã trả lời
          </Text>
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <ActivityIndicator
          size="large"
          color="#16a34a"
          style={{ marginTop: 50 }}
        />
      ) : feedbacks.length === 0 ? (
        <Text style={styles.emptyText}>
          Không có phản hồi nào trong mục này.
        </Text>
      ) : (
        feedbacks.map((fb, idx) => (
          <View key={idx} style={styles.feedbackCard}>
            <View style={styles.fbHeader}>
              <View>
                <Text style={styles.fbName}>
                  {fb.userId?.fullName || "Người dùng ẩn danh"}
                </Text>
                <Text style={styles.fbEmail}>{fb.userId?.email}</Text>
              </View>
              <View style={styles.fbCategoryBadge}>
                <Text style={styles.fbCategoryText}>{fb.category}</Text>
              </View>
            </View>

            <View style={styles.fbContentBox}>
              <Text style={styles.fbContentText}>{fb.content}</Text>
              <Text style={styles.fbDate}>
                {new Date(fb.createdAt).toLocaleDateString("vi-VN")} lúc{" "}
                {new Date(fb.createdAt).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>

            {status === "PENDING" ? (
              replyingId === fb._id ? (
                <View style={styles.replyBox}>
                  <TextInput
                    style={styles.replyInput}
                    placeholder="Nhập câu trả lời của Admin..."
                    multiline
                    value={replyContent}
                    onChangeText={onReplyContentChange}
                  />
                  <View style={styles.replyActions}>
                    <TouchableOpacity
                      style={styles.cancelReplyBtn}
                      onPress={() => {
                        onReplyingIdChange(null);
                        onReplyContentChange("");
                      }}
                    >
                      <Text style={styles.cancelReplyText}>Hủy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.submitReplyBtn}
                      onPress={() => onSubmitReply(fb._id)}
                      disabled={isSubmittingReply}
                    >
                      {isSubmittingReply ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <>
                          <Send size={16} color="#fff" />
                          <Text style={styles.submitReplyText}>
                            Gửi trả lời
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.openReplyBtn}
                  onPress={() => onReplyingIdChange(fb._id)}
                >
                  <MessageSquare size={16} color="#16a34a" />
                  <Text style={styles.openReplyText}>Trả lời phản hồi này</Text>
                </TouchableOpacity>
              )
            ) : (
              <View style={styles.repliedBox}>
                <Text style={styles.repliedLabel}>Admin đã trả lời:</Text>
                <Text style={styles.repliedContent}>{fb.adminReply}</Text>
                <Text style={styles.fbDate}>
                  Trả lời lúc:{" "}
                  {new Date(fb.repliedAt).toLocaleDateString("vi-VN")}{" "}
                  {new Date(fb.repliedAt).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
            )}
          </View>
        ))
      )}
    </View>
  );
}
