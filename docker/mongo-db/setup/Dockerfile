FROM mongo:4.0

# Workdir configs directory
WORKDIR /user/src/configs

# copy improtant files
COPY replica-set.js .
COPY setup.sh .

EXPOSE 27017

# add execute permission to setup.sh
RUN ["chmod", "+x", "./setup.sh"]

# execute script
CMD ["./setup.sh"]