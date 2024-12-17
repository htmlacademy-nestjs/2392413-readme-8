import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogTagService } from '@project/blog-tag';
import { BlogPostEntity } from './blog-post.entity';
import { BlogPostFactory } from './blog-post.factory';
import { BlogPostRepository } from './blog-post.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class BlogPostService {
  constructor(
    private readonly blogPostRepository: BlogPostRepository,
    private readonly blogTagService: BlogTagService
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
}
