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
    video: "/assets/projects/zeal/authChek.webm",
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
    type: "Mobile & Cloud Platform",
    description:
      "An all-in-one mobile product cataloging, inventory tracking, and QR code authentication platform built with React Native (Expo) and a Spring Boot backend.",
    overview:
      "Developed for NTU's Mobile & Ubiquitous Applications Development module (IN6222), TrustMark modernizes product inventory and brand protection for SMEs. The platform enables creators to manage multi-tiered product catalogs and collections, generate per-item unique QR code certificates for instant authenticity verification, track real-time stock levels, and orchestrate order shipping workflows through an intuitive mobile interface.",
    contributions: [
      "Architected a cross-platform mobile application using React Native and Expo Router with modular screen flows (Collections, Shipping, QR Authenticity).",
      "Engineered a Spring Boot REST API backend with Spring Data JPA and MySQL for brand, collection, and product item persistence.",
      "Implemented an automated QR certificate lifecycle protocol generating unique item-level serials for instant authenticity verification.",
      "Built real-time stock visibility tracking (In Stock, Low Stock, Out of Stock) based on produced vs remaining inventory ratios.",
      "Created order fulfillment and shipping progress simulation flows with batch dispatching for in-stock inventory.",
      "Containerized the multi-service architecture (Spring Boot backend and MySQL database) using Docker and Docker Compose.",
    ],
    technologies: [
      "React Native",
      "Expo",
      "Spring Boot",
      "Java",
      "MySQL",
      "Docker",
      "REST APIs",
      "goQR API",
    ],
    filename: "AuthCheckScreen.tsx",
    github: "https://github.com/irfandra/TrustMark",
    snippet: `export const verifyProductCertificate = async (qrPayload: string) => {
  const serial = normalizeQrCertificate(qrPayload);
  const { data } = await apiClient.get(\`/api/v1/products/verify/\${serial}\`);

  if (data.status === "ACTIVE") {
    return {
      authentic: true,
      productName: data.productName,
      stockStatus: data.stockStatus, // In Stock, Low Stock, Out of Stock
      certificateUrl: data.certificateQrUrl,
    };
  }

  return { authentic: false, message: "Invalid or revoked certificate" };
};`,
  },
  {
    slug: "receipt-hub",
    name: "ReceiptHub",
    type: "Full-Stack & Cloud Platform",
    description:
      "An intelligent expense and reimbursement platform with automated OCR receipt parsing, Telegram Bot submissions, and a Spring Boot management dashboard.",
    overview:
      "Developed for NTU's Internet & Web Applications Development module (IN6206), ReceiptHub digitizes corporate expense workflows. Employees snap receipt photos via Telegram Bot with automated OCR extraction, while finance administrators review, audit, and approve claims through a secure Spring Boot and Thymeleaf dashboard with event-driven notifications.",
    contributions: [
      "Built an event-driven Spring Boot 3 (Java 21) backend with asynchronous Spring Events for real-time Telegram notifications.",
      "Integrated OCR.space API with Resilience4j circuit breakers for resilient automated receipt text extraction.",
      "Implemented S3-compatible cloud storage with MinIO and containerized the multi-service stack using Docker Compose.",
      "Configured role-based access control (ADMIN/EMPLOYEE), CSRF protection, and session security using Spring Security.",
      "Engineered responsive, server-rendered web dashboards using Thymeleaf, Tailwind CSS, and MySQL persistence.",
    ],
    technologies: [
      "Spring Boot",
      "Java 21",
      "Thymeleaf",
      "Tailwind CSS",
      "MySQL",
      "MinIO (S3)",
      "Telegram Bot API",
      "OCR.space",
      "Docker",
    ],
    image: "/assets/projects/receipt-hub/telegram-ocr.jpg",
    previewLabel: "Telegram Bot OCR",
    filename: "ReimbursementService.java",
    github: "https://github.com/irfandra/ReceiptHub",
    snippet: `@Service
@RequiredArgsConstructor
public class ReimbursementService {
    private final ReimbursementRequestRepository repository;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public ReimbursementRequest reviewRequest(Long id, Long adminId, RequestStatus status, String notes) {
        ReimbursementRequest req = repository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Request not found"));
        
        req.setStatus(status);
        req.setReviewNotes(notes);
        req.setReviewedBy(adminId);
        req.setReviewedAt(LocalDateTime.now());
        
        ReimbursementRequest saved = repository.save(req);
        eventPublisher.publishEvent(new ReimbursementReviewedEvent(saved));
        return saved;
    }
}`,
  },
  {
    slug: "data-mining",
    name: "Data Mining",
    type: "Machine Learning & Analytics",
    description:
      "A 3-part data mining curriculum covering Census Income classification, MovieLens association rule mining (Apriori), and customer segmentation with K-Means clustering.",
    overview:
      "Completed as part of NTU's Data Mining module (IN6227), this project consolidates three core machine learning assignments: (1) automated preprocessing and classification on the Adult Census Income dataset, (2) association rule mining comparing Apriori and brute-force approaches on MovieLens, and (3) unsupervised customer segmentation using K-Means clustering with Elbow/Silhouette validation and geometry analysis.",
    contributions: [
      "Assignment 1: Built an automated ColumnTransformer preprocessing pipeline and optimized Random Forest & Logistic Regression models via GridSearchCV.",
      "Assignment 2: Benchmarked Apriori vs brute-force frequent itemset discovery across varying basket dimensions on MovieLens.",
      "Assignment 3: Developed custom K-Means centroid convergence visualizers, determined optimal clusters with WCSS/Silhouette, and evaluated cluster shape limitations.",
    ],
    technologies: [
      "Python",
      "Jupyter",
      "Scikit-Learn",
      "Pandas",
      "NumPy",
      "MLxtend",
      "K-Means",
      "Apriori",
      "Matplotlib",
    ],
    image: "/assets/projects/data-mining/a3-kmeans-clusters.png",
    previewLabel: "K-Means Clusters & Centroids",
    filename: "kmeans_clustering.py",
    snippet: `from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

# WCSS Elbow calculation and Silhouette analysis
wcss, silhouette_scores = [], []
for k in range(2, 11):
    model = KMeans(n_clusters=k, init='k-means++', random_state=42)
    model.fit(X)
    wcss.append(model.inertia_)
    silhouette_scores.append(silhouette_score(X, model.labels_))

# Optimal K=5 selected based on elbow curve & silhouette score
optimal_kmeans = KMeans(n_clusters=5, init='k-means++', random_state=42)
optimal_kmeans.fit(X)`,
    assignments: [
      {
        id: "assignment-1",
        title: "Assignment 1: Data Preprocessing & Predictive Modeling",
        dataset: "Adult Census Income Dataset",
        description:
          "End-to-end data cleaning, handling missing values, categorical encoding, and feature scaling using Scikit-Learn pipelines. Benchmarked Logistic Regression and Random Forest with GridSearchCV hyperparameter tuning.",
        github: "https://github.com/irfandra/IN6227-2025-Assignment-1",
        filename: "01_data_exploration.py",
        image: "/assets/projects/data-mining/a1-roc-pr-curves.png",
        imageLabel: "Model Evaluation: ROC & Precision-Recall Curves (Logistic Regression vs Random Forest)",
        snippet: `from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import GridSearchCV

# Automated preprocessing pipeline
preprocessor = ColumnTransformer([
    ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_cols),
    ('num', StandardScaler(), numerical_cols)
])

pipe_rf = Pipeline([
    ('preprocessor', preprocessor),
    ('clf', RandomForestClassifier(random_state=42))
])

# Hyperparameter optimization using GridSearchCV
param_grid = {
    'clf__n_estimators': [50, 100],
    'clf__max_depth': [10, 20]
}
grid_search = GridSearchCV(pipe_rf, param_grid, cv=3, scoring='f1_macro')
grid_search.fit(X_train, y_train)`,
      },
      {
        id: "assignment-2",
        title: "Assignment 2: Association Rule Mining (Apriori vs Brute Force)",
        dataset: "MovieLens 100k Dataset",
        description:
          "Constructed user-movie transaction baskets (filtered for ratings ≥ 4.0 and ≥ 25 users). Benchmarked the Apriori algorithm against an exhaustive brute-force itemset generator across varying basket sizes (M = 10 to 35), evaluating execution runtime, support, confidence, and lift.",
        github: "https://github.com/irfandra/IN6227-2025-Assignment-2",
        filename: "association_rules.py",
        image: "/assets/projects/data-mining/a2-apriori-vs-bruteforce.png",
        imageLabel: "Runtime Benchmark: Apriori vs Brute-Force Scaling Comparison (Log Scale)",
        snippet: `from mlxtend.frequent_patterns import apriori, association_rules

# Mining frequent itemsets with minimum support threshold
frequent_itemsets = apriori(
    basket_df, 
    min_support=0.05, 
    use_colnames=True
)

# Generating high-confidence association rules
rules = association_rules(
    frequent_itemsets, 
    metric="confidence", 
    min_threshold=0.5
)

# Ranking rules by lift and confidence
strong_rules = rules[rules['lift'] > 1.2].sort_values(
    by='lift', 
    ascending=False
)`,
      },
      {
        id: "assignment-3",
        title: "Assignment 3: K-Means Clustering & Centroid Visualizer",
        dataset: "Mall Customer Segmentation Dataset",
        description:
          "Unsupervised segmentation on customer spending and income attributes. Determined optimal cluster count (K=5) using WCSS Elbow method and Silhouette coefficient. Built a custom KMeansVisualizer tracking step-by-step centroid updates across iterations.",
        github: "https://github.com/irfandra/IN6227-2025-Assignment-3",
        filename: "kmeans_clustering.py",
        image: "/assets/projects/data-mining/a3-kmeans-clusters.png",
        imageLabel: "Customer Segmentation: K-Means Cluster Centroids & Iterative Convergence (K=5)",
        snippet: `from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

# WCSS Elbow calculation and Silhouette analysis
wcss, silhouette_scores = [], []
for k in range(2, 11):
    model = KMeans(n_clusters=k, init='k-means++', random_state=42)
    model.fit(X)
    wcss.append(model.inertia_)
    silhouette_scores.append(silhouette_score(X, model.labels_))

# Optimal K=5 selected based on the elbow curve and silhouette peak
optimal_kmeans = KMeans(n_clusters=5, init='k-means++', random_state=42)
optimal_kmeans.fit(X)`,
      },
    ],
  },
  {
    slug: "portfolio-v1",
    name: "Portfolio V1",
    type: "Personal / Frontend",
    description: "Previous iteration of my personal portfolio built with pure HTML, CSS, and Vanilla JavaScript with simple scroll animations.",
    overview: "A lightweight, no-framework personal website.",
    contributions: ["Designed the layout", "Implemented vanilla JS scroll observers"],
    technologies: ["HTML", "CSS", "JavaScript"],
    snippet: `const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
    }
  });
});`,
  },
];

export function getProject(slug) {
  return projects.find((project) => project.slug === slug);
}
