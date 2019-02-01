FROM mongo:4.0

# Workdir configs directory
WORKDIR /user/src/configs

# Copy config files
COPY mongo.conf .

# use configuration from a custom config file
CMD ["--config", "./mongo.conf"]