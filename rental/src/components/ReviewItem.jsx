import React from 'react';
import { makeStyles } from '@mui/styles';
import { Rating } from '@mui/material';
import { Star } from '@mui/icons-material';

const useStyles = makeStyles({
  review: {
    display: 'flex',
    flexDirection: 'column',
    borderBottom: '1px solid #ddd',
    paddingBottom: '1rem'
  },
  reviewTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1rem'
  },
  noCommentsReview: {
    color: '#888',
    fontStyle: 'italic',
    margin: 0
  }
});

export default function ReviewItem (props) {
  const classes = useStyles();
  const { review } = props;

  return (
    <div className={classes.review}>
      <div className={classes.reviewTop}>
        <h4>{review.user}</h4>
        <Rating readOnly name="feedback" value={review.rating} emptyIcon={<Star style={{ opacity: 0.55 }} fontSize="inherit" />} />
      </div>
      <div>
        {review.text || <p className={classes.noCommentsReview}>This user does not write any comments</p>}
      </div>
    </div>
  )
}