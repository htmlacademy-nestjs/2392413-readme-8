import { PostState, PostType } from '@prisma/client';
import { BlogCommentEntity, BlogCommentFactory } from '@project/blog-comment';
import { BlogTagEntity, BlogTagFactory } from '@project/blog-tag';
import {
  Entity,
  Post,
  PostExtraProperty,
  StorableEntity,
} from '@project/shared/core';

export class BlogPostEntity extends Entity implements StorableEntity<Post> {
  public postType!: PostType;
  public authorId!: string;
  public isRepost!: boolean;
  public originAuthorId?: string;
  public originPostId?: string;
  public tags!: BlogTagEntity[];
  public state!: PostState;
  public createdAt!: Date;
  public publicDate!: Date;
  public likesCount!: number;
  public commentsCount!: number;
  public extraProperty?: PostExtraProperty;
  public comments!: BlogCommentEntity[];

  constructor(post?: Post) {
    super();
    this.populate(post);
  }
  public populate(post?: Post): void {
    if (!post) {
      return;
    }
    const {
      id,
      postType,
      authorId,
      isRepost,
      originAuthorId,
      originPostId,
      tags,
      state,
      createdAt,
      publicDate,
      likesCount,
      commentsCount,
      extraProperty,
      comments,
    } = post;

    this.id = id ?? '';
    this.postType = postType;
    this.authorId = authorId;
    this.isRepost = isRepost;
    this.originAuthorId = originAuthorId ?? '';
    this.originPostId = originPostId ?? '';
    this.tags = [];
    this.state = state;
    this.createdAt = createdAt;
    this.publicDate = publicDate;
    this.likesCount = likesCount;
    this.commentsCount = commentsCount;
    this.extraProperty = extraProperty ?? undefined;
    this.comments = [];

    const blogCommentFactory = new BlogCommentFactory();
    for (const comment of comments) {
      const blogCommentEntity = blogCommentFactory.create(comment);
      this.comments.push(blogCommentEntity);
    }

    const blogTagFactory = new BlogTagFactory();
    for (const tag of tags) {
      const blogTagEntity = blogTagFactory.create(tag);
      this.tags.push(blogTagEntity);
    }
  }

  toPOJO(): Post {
    return {
      id: this.id,
      postType: this.postType,
      authorId: this.authorId,
      isRepost: this.isRepost,
      originAuthorId: this.originAuthorId ?? '',
      originPostId: this.originPostId ?? '',
      state: this.state,
      createdAt: this.createdAt,
      publicDate: this.publicDate,
      likesCount: this.likesCount,
      commentsCount: this.commentsCount,
      extraProperty: this.extraProperty ?? null,
      tags: this.tags.map((tagEntity) => tagEntity.toPOJO()),
      comments: this.comments.map((commentEntity) => commentEntity.toPOJO()),
    };
  }
}
