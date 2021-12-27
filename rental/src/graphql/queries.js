/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getListing = /* GraphQL */ `
  query GetListing($id: ID!) {
    getListing(id: $id) {
      id
      title
      owner
      address {
        street
        city
        state
        postcode
        country
      }
      price
      thumbnail
      metadata {
        bathrooms
        type
        bedrooms {
          id
          numOfBeds
        }
        amenities {
          essentials
          airConditioning
          wirelessInternet
          washer
          kitchen
          pool
        }
        totalBeds
        images
      }
      reviews {
        rating
        user
        text
      }
      availability
      published
      postedOn
      createdAt
      updatedAt
    }
  }
`;
export const listListings = /* GraphQL */ `
  query ListListings(
    $filter: ModelListingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listListings(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        owner
        address {
          street
          city
          state
          postcode
          country
        }
        price
        thumbnail
        metadata {
          bathrooms
          type
          totalBeds
          images
        }
        reviews {
          rating
          user
          text
        }
        availability
        published
        postedOn
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getBooking = /* GraphQL */ `
  query GetBooking($id: ID!) {
    getBooking(id: $id) {
      id
      owner
      dateRange {
        start
        end
      }
      totalPrice
      listingId
      status
      createdAt
      updatedAt
    }
  }
`;
export const listBookings = /* GraphQL */ `
  query ListBookings(
    $filter: ModelBookingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listBookings(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        owner
        dateRange {
          start
          end
        }
        totalPrice
        listingId
        status
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
