import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean };

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Unhandled UI error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "3rem", textAlign: "center", color: "#fff", background: "#08070b", minHeight: "100vh" }}>
          <h1>เกิดข้อผิดพลาด</h1>
          <p>กรุณาโทรสอบถามร้านโดยตรงที่ 035-213134 หรือลองรีเฟรชหน้านี้ใหม่</p>
        </div>
      );
    }
    return this.props.children;
  }
}
