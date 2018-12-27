############################################################
# Dockerfile to build Nginx Installed Containers
# Based on Ubuntu
############################################################


# Set the base image to Ubuntu
FROM ubuntu

# File Author / Maintainer
MAINTAINER Andreja Jevtic

# Update the repository
RUN apt-get update

# Install necessary tools
RUN apt-get install -y vim wget net-tools curl nginx

# Set the custom nginx.conf file
COPY nginx.conf /etc/nginx/

# Copy all sites enabled files from the current directory
ADD ./sites-enabled/* /etc/nginx/sites-enabled/

# Copy all custom config files from the current directory
ADD ./conf/* /etc/nginx/config.d/

#RUN mkdir /etc/nginx/logs

# Append "daemon off;" to the end of the configuration
# so that nginx can be ran in the foreground
RUN echo "daemon off;" >> /etc/nginx/nginx.conf

# Expose ports
EXPOSE 80

# Start the nginx server
CMD ["nginx"]
