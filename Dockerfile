FROM node:slim

# Setup folders for notes & attachments
RUN mkdir notes
RUN mkdir attachments

# Copy in code
RUN mkdir server
COPY server server/

# Setup node dependencies
WORKDIR server
RUN npm install .

# Run server
CMD node index.js