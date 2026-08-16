import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_ENV: str = os.getenv("APP_ENV", "development")
    ALLOW_SEED: bool = os.getenv("ALLOW_SEED", "true" if os.getenv("APP_ENV", "development") == "development" else "false").lower() in {"1", "true", "yes", "on"}
    SEED_ADMIN_EMAIL: str = os.getenv("SEED_ADMIN_EMAIL", "admin@learni.com")
    SEED_ADMIN_PASSWORD: str = os.getenv("SEED_ADMIN_PASSWORD", "password123")
    SEED_STUDENT_EMAIL: str = os.getenv("SEED_STUDENT_EMAIL", "student@learni.com")
    SEED_STUDENT_PASSWORD: str = os.getenv("SEED_STUDENT_PASSWORD", "password123")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./learni.db")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "super_secret_learni_jwt_key_2026_change_in_production")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
    STRIPE_SECRET_KEY: str = os.getenv("STRIPE_SECRET_KEY", "sk_test_mock_key")
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")
    CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "http://localhost:5173,https://online-courses-azure.vercel.app")

    @property
    def cors_origins(self):
        return [origin.strip() for origin in self.CORS_ORIGINS.split(',') if origin.strip()]

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
