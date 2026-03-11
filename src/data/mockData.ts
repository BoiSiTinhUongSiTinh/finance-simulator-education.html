export interface Flashcard {
  id: number;
  term: string;
  definition: string;
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Category {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface DailyTask {
  id: string;
  title: string;
  reward: number;
  completed: boolean;
}

export const CENTRAL_BANKING_FLASHCARDS: Flashcard[] = [
  {
    id: 1,
    term: "Chính sách Tiền tệ",
    definition: "Quá trình mà cơ quan quản lý tiền tệ của một quốc gia kiểm soát cung tiền, thường nhắm mục tiêu vào tỷ lệ lạm phát hoặc lãi suất để đảm bảo ổn định giá cả và niềm tin vào đồng nội tệ."
  },
  {
    id: 2,
    term: "Người cho vay cuối cùng",
    definition: "Một tổ chức, thường là ngân hàng trung ương, cung cấp các khoản vay cho các ngân hàng hoặc tổ chức đủ điều kiện khác đang gặp khó khăn về tài chính hoặc bị coi là rủi ro cao."
  },
  {
    id: 3,
    term: "Nghiệp vụ Thị trường Mở (OMO)",
    definition: "Việc mua và bán các chứng khoán chính phủ trên thị trường mở nhằm mở rộng hoặc thu hẹp lượng tiền trong hệ thống ngân hàng."
  },
  {
    id: 4,
    term: "Dự trữ Bắt buộc",
    definition: "Quy định của ngân hàng trung ương đặt ra mức dự trữ tối thiểu mà một ngân hàng thương mại phải nắm giữ."
  },
  {
    id: 5,
    term: "Nới lỏng Định lượng (QE)",
    definition: "Một hình thức chính sách tiền tệ trong đó ngân hàng trung ương mua tài sản tài chính quy mô lớn từ thị trường mở để bơm tiền vào nền kinh tế."
  }
];

export const CENTRAL_BANKING_QUIZ: Question[] = [
  {
    id: 1,
    question: "Mục tiêu chính của hầu hết các ngân hàng trung ương hiện đại là gì?",
    options: ["Tối đa hóa lợi nhuận ngân hàng thương mại", "Ổn định giá cả (Kiểm soát lạm phát)", "Tài trợ thâm hụt ngân sách chính phủ", "Thiết lập giá thị trường chứng khoán"],
    correctAnswer: 1,
    explanation: "Hầu hết các ngân hàng trung ương ưu tiên ổn định giá cả để đảm bảo tăng trưởng kinh tế dài hạn."
  },
  {
    id: 2,
    question: "Điều gì xảy ra với cung tiền khi ngân hàng trung ương bán trái phiếu chính phủ?",
    options: ["Tăng lên", "Giảm đi", "Không thay đổi", "Biến động mạnh"],
    correctAnswer: 1,
    explanation: "Bán trái phiếu sẽ rút thanh khoản khỏi hệ thống ngân hàng, do đó làm giảm cung tiền."
  },
  {
    id: 3,
    question: "'Lãi suất Chiết khấu' đề cập đến:",
    options: ["Lãi suất ngân hàng tính cho khách hàng tốt nhất", "Lãi suất ngân hàng trung ương tính cho các ngân hàng thương mại đối với các khoản vay ngắn hạn", "Tỷ lệ lạm phát", "Mức giảm thuế chính phủ"],
    correctAnswer: 1,
    explanation: "Lãi suất chiết khấu là lãi suất mà ngân hàng trung ương tính cho các tổ chức lưu ký đối với các khoản vay họ nhận được từ cửa sổ chiết khấu."
  },
  {
    id: 4,
    question: "Công cụ nào được các ngân hàng trung ương sử dụng thường xuyên nhất để tác động đến lãi suất?",
    options: ["Thay đổi dự trữ bắt buộc", "Nghiệp vụ thị trường mở", "Thuyết phục bằng đạo đức", "Kiểm soát tín dụng trực tiếp"],
    correctAnswer: 1,
    explanation: "Nghiệp vụ thị trường mở linh hoạt, chính xác và dễ dàng đảo ngược, khiến chúng trở thành công cụ được ưu tiên."
  },
  {
    id: 5,
    question: "'Hệ số An toàn Vốn' (CAR) được thiết kế để đảm bảo điều gì?",
    options: ["Ngân hàng có đủ tiền mặt cho rút tiền hàng ngày", "Ngân hàng có thể hấp thụ một lượng lỗ hợp lý và tuân thủ các yêu cầu về vốn theo luật định", "Chính phủ có đủ dự trữ vàng", "Lãi suất duy trì ở mức thấp"],
    correctAnswer: 1,
    explanation: "CAR đảm bảo rằng các ngân hàng có đủ đệm để hấp thụ các khoản lỗ trước khi trở nên mất khả năng thanh toán."
  }
];

export const CATEGORIES: Category[] = [
  {
    id: "central-banking",
    title: "Ngân hàng Trung ương",
    description: "Chính sách tiền tệ, dự trữ bắt buộc và vai trò của ngân hàng trung ương.",
    icon: "Landmark"
  },
  {
    id: "corporate-finance",
    title: "Tài chính Doanh nghiệp",
    description: "Cấu trúc vốn, chính sách cổ tức và thẩm định đầu tư.",
    icon: "Briefcase"
  },
  {
    id: "commercial-banking",
    title: "Ngân hàng Thương mại",
    description: "Hoạt động bán lẻ, phân tích tín dụng và quản trị rủi ro.",
    icon: "Building2"
  },
  {
    id: "international-finance",
    title: "Tài chính Quốc tế",
    description: "Ngoại hối, cán cân thanh toán và thị trường toàn cầu.",
    icon: "Globe"
  }
];

export const INITIAL_DAILY_TASKS: DailyTask[] = [
  { id: '1', title: 'Hoàn thành 1 bộ Flashcard', reward: 50, completed: false },
  { id: '2', title: 'Đạt điểm tối đa trong 1 bài Quiz', reward: 100, completed: false },
  { id: '3', title: 'Sử dụng công cụ tính toán tài chính', reward: 30, completed: false },
];
