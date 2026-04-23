export const up = (pgm) => {
  pgm.createTable('comment_likes', {
    id: { type: 'VARCHAR(50)', primaryKey: true },
    comment_id: { type: 'VARCHAR(50)', notNull: true },
    user_id: { type: 'VARCHAR(50)', notNull: true },
  });

  pgm.addConstraint(
    'comment_likes',
    'unique_comment_likes_comment_id_user_id',
    'UNIQUE(comment_id, user_id)',
  );

  pgm.addConstraint(
    'comment_likes',
    'fk_comment_likes_comment_id_comments',
    'FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE',
  );

  pgm.addConstraint(
    'comment_likes',
    'fk_comment_likes_user_id_users',
    'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE',
  );
};

export const down = (pgm) => {
  pgm.dropTable('comment_likes');
};
