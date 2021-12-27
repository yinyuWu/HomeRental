/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateListing = /* GraphQL */ `
  subscription OnCreateListing {
    onCreateListing {
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
export const onUpdateListing = /* GraphQL */ `
  subscription OnUpdateListing {
    onUpdateListing {
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
export const onDeleteListing = /* GraphQL */ `
  subscription OnDeleteListing {
    onDeleteListing {
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
export const onCreateBooking = /* GraphQL */ `
  subscription OnCreateBooking {
    onCreateBooking {
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
export const onUpdateBooking = /* GraphQL */ `
  subscription OnUpdateBooking {
    onUpdateBooking {
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
export const onDeleteBooking = /* GraphQL */ `
  subscription OnDeleteBooking {
    onDeleteBooking {
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
