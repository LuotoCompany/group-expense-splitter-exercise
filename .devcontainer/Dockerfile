# Use Node.js LTS with Debian slim - best balance of size and debugging capability
FROM node:22-bookworm-slim

# Install system dependencies and development tools
RUN apt-get update && apt-get install -y --no-install-recommends \
    # Version control
    git \
    openssh-client \
    # Tools needed for PostgreSQL repo
    gnupg \
    lsb-release \
    # Database - Redis
    redis-server \
    redis-tools \
    # Build tools for native dependencies
    build-essential \
    python3 \
    # Network and debugging tools
    curl \
    wget \
    vim \
    nano \
    # Process management
    procps \
    # SSL certificates
    ca-certificates \
    # For direnv (optional)
    direnv \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install PostgreSQL 18 from official PostgreSQL repository
RUN curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc | gpg --dearmor -o /usr/share/keyrings/postgresql-keyring.gpg && \
    echo "deb [signed-by=/usr/share/keyrings/postgresql-keyring.gpg] http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list && \
    apt-get update && \
    apt-get install -y --no-install-recommends \
    postgresql-18 \
    postgresql-client-18 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Enable corepack for pnpm/yarn support
RUN corepack enable

# Configure PostgreSQL
RUN mkdir -p /var/run/postgresql && \
    chown postgres:postgres /var/run/postgresql && \
    chmod 2777 /var/run/postgresql

# Configure Redis
RUN mkdir -p /var/lib/redis && \
    chown redis:redis /var/lib/redis

# Create workspace directory with proper permissions
RUN mkdir -p /workspace && chown -R node:node /workspace

# Set working directory
WORKDIR /workspace

# Switch to non-root user
USER node

# Set up environment
ENV SHELL=/bin/bash \
    NODE_ENV=development

# Expose common ports
EXPOSE 3000 5432 6379

# Default command - keep container running
CMD ["/bin/bash"]
