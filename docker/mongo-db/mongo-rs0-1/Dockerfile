FROM mongo

# Workdir configs directory
WORKDIR /user/src/configs

# Copy config files
COPY mongo.conf .

EXPOSE 27017

# use configuration from a custom config file
CMD ["--config", "./mongo.conf"]