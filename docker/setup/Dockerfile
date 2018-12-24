FROM mongo

# Workdir configs directory

WORKDIR /user/src/configs

# Install app dependencies
COPY replica-set.js .
COPY setup.sh .

EXPOSE 27017

RUN ["chmod", "+x", "./setup.sh"]
CMD ["./setup.sh"]