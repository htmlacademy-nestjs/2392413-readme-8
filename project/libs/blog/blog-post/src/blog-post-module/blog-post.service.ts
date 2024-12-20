import { Injectable, NotFoundException } from '@nestjs/common';
import {
  BlogCommentEntity,
  BlogCommentFactory,
  BlogCommentRepository,
  CreateCommentDto,
} from '@project/blog-comment';
import { BlogTagService } from '@project/blog-tag';
import { PaginationResult } from '@project/shared/core';
import { BlogPostEntity } from './blog-post.entity';
import { BlogPostFactory } from './blog-post.factory';
import { BlogPostQuery } from './blog-post.query';
import { BlogPostRepository } from './blog-post.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class BlogPostService {
  constructor(
    private readonly blogPostRepository: BlogPostRepository,
    private readonly blogTagService: BlogTagService,
    private readonly blogCommentRepository: BlogCommentRepository,
    private readonly blogCommentFactory: BlogCommentFactory
  ) {}

  public async createPost(dto: CreatePostDto): Promise<BlogPostEntity> {
    const tags = dto.tags
      ? await this.blogTagService.findOrCreate(dto.tags)
      : [];

    const newPost = BlogPostFactory.createFromCreatePostDto(dto, tags);
    await this.blogPostRepository.save(newPost);

    return newPost;
  }

  public async updatePost(
    id: string,
    dto: UpdatePostDto
  ): Promise<BlogPostEntity> {
    const existPost = await this.blogPostRepository.findById(id);
    if (!existPost) {
      throw new NotFoundException(`Post with id ${id} not found.`);
    }

    for (const [key, value] of Object.entries(dto)) {
      if (value !== undefined && key !== 'tags' && existPost[key] !== value) {
        existPost[key] = value;
      }
      if (key === 'tags' && value) {
        existPost.tags = await this.blogTagService.findOrCreate(dto.tags);
      }
    }

    await this.blogPostRepository.update(existPost);
    return existPost;
  }

  public async deletePost(id: string): Promise<void> {
    try {
      await this.blogPostRepository.deleteById(id);
    } catch {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
  }

  public async getPost(id: string): Promise<BlogPostEntity> {
    return this.blogPostRepository.findById(id);
  }

  public async getPosts(
    query?: BlogPostQuery
  ): Promise<PaginationResult<BlogPostEntity | null>> {
    return this.blogPostRepository.find(query);
  }

  public async addComment(
    postId: string,
    dto: CreateCommentDto
  ): Promise<BlogCommentEntity> {
    const existsPost = await this.getPost(postId);
    const newComment = this.blogCommentFactory.createFromDto(
      dto,
      existsPost.id
    );
    await this.blogCommentRepository.save(newComment);

    return newComment;
  }
}
