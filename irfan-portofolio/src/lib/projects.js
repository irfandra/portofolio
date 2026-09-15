export const projects = [
  {
    slug: "zeal",
    name: "Zeal",
    type: "Blockchain / Mobile Platform",
    description:
      "An end-to-end NFT authenticity platform for brand protection with blockchain-based minting and verification, secure backend APIs, and a companion mobile app.",
    overview:
      "Zeal connects physical products to verifiable digital identities. Brands can mint authenticity records, while customers can scan and validate product provenance through a mobile experience.",
    contributions: [
      "Designed the product authenticity flow from minting through verification.",
      "Structured secure backend APIs for product and verification records.",
      "Planned the mobile scanning experience for fast customer validation.",
    ],
    technologies: ["Solidity", "Hardhat", "Polygon", "Smart Contracts", "React Native", "REST APIs"],
    snippet: `const verifyProduct = async (tokenId) => {
  const product = await contract.products(tokenId);

  return {
    authentic: product.owner !== ethers.ZeroAddress,
    productId: product.id,
    mintedAt: product.mintedAt,
  };
};`,
  },
  {
    slug: "trustmark",
    name: "TrustMark",
    type: "Supply Chain Platform",
    description:
      "A product catalog and supply chain tracking platform with QR code generation for provenance verification, enabling brands and consumers to trace product history end-to-end.",
    overview:
      "TrustMark makes supply chain history easier to inspect by pairing product records with scannable QR codes and a clear provenance trail.",
    contributions: [
      "Mapped product history into a traceable catalog structure.",
      "Designed QR-based provenance verification flows.",
      "Created a consumer-facing journey for inspecting product history.",
    ],
    technologies: ["React", "Node.js", "QR Codes", "REST APIs", "PostgreSQL"],
    snippet: `const createTraceCode = async (productId) => {
  const traceUrl = new URL(
    \`/trace/\${productId}\`,
    process.env.PUBLIC_APP_URL
  );

  return QRCode.toDataURL(traceUrl.toString());
};`,
  },
  {
    slug: "receipt-hub",
    name: "Receipt Hub",
    type: "Workflow Automation",
    description:
      "A receipt and reimbursement management platform designed to digitize expense submission, approval, and tracking workflows.",
    overview:
      "Receipt Hub replaces fragmented expense handling with a single workflow for submitting receipts, routing approvals, and tracking reimbursement status.",
    contributions: [
      "Designed the expense submission and approval workflow.",
      "Structured status tracking for employees and approvers.",
      "Focused the interface on reducing repetitive manual administration.",
    ],
    technologies: ["Next.js", "Node.js", "SQL", "Workflow Automation", "Role-based Access"],
    snippet: `const submitExpense = async (expense) => {
  const record = await db.expenses.create({
    data: { ...expense, status: "PENDING_APPROVAL" },
  });

  await notifyApprover(record);
  return record;
};`,
  },
  {
    slug: "data-mining",
    name: "Data Mining",
    type: "Academic / Machine Learning",
    description:
      "Coursework projects for NTU's Data Mining and Machine Learning module, applying classification and optimization algorithms to real-world datasets in Python and Jupyter.",
    overview:
      "This collection explores how data preparation, classification, and optimization can turn messy real-world datasets into useful decisions.",
    contributions: [
      "Prepared and explored real-world datasets in Jupyter notebooks.",
      "Applied classification algorithms and compared model performance.",
      "Used optimization techniques to improve the quality of results.",
    ],
    technologies: ["Python", "Jupyter", "Data Mining", "Classification", "Optimization"],
    snippet: `from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

X_train, X_test, y_train, y_test = train_test_split(
    features, labels, test_size=0.2, random_state=42
)

model.fit(X_train, y_train)
print(classification_report(y_test, model.predict(X_test)))`,
  },
];

export function getProject(slug) {
  return projects.find((project) => project.slug === slug);
}
