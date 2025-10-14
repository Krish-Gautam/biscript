FROM ghcr.io/engineer-man/piston:latest

# Create writable directories for Render deployment
RUN mkdir -p /tmp/isolate /tmp/packages /tmp/cache

# Set environment variables for Render deployment
ENV PISTON_DATA_DIRECTORY=/tmp
ENV PISTON_BIND_ADDRESS=0.0.0.0:2000
ENV PORT=2000
ENV PISTON_DISABLE_NETWORKING=false

# Create a non-root user for security
RUN useradd -m -u 1000 piston && \
    chown -R piston:piston /tmp

USER piston

EXPOSE 2000

# Use the default piston entrypoint
CMD ["node", "/piston/api/src/index.js"]
