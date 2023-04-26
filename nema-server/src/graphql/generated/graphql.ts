import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  JSON: any;
  JSONObject: any;
};

export type CreateOrUpdateDocumentInfoInput = {
  details: Scalars['JSONObject'];
  name: Scalars['String'];
  namespace: Scalars['String'];
  type: Scalars['String'];
  url: Scalars['String'];
};

export type CreateSignedUrlInput = {
  contentType: Scalars['String'];
  name: Scalars['String'];
};

export type DocumentInfo = {
  __typename?: 'DocumentInfo';
  createdAt: Scalars['String'];
  details: Scalars['JSONObject'];
  id: Scalars['String'];
  indexed: Scalars['Boolean'];
  indexedAt?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  namespace: Scalars['String'];
  spaceId: Scalars['String'];
  type: Scalars['String'];
  updatedAt: Scalars['String'];
  url: Scalars['String'];
  xpath?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createDocumentInfo: DocumentInfo;
  createSignedUrl: Scalars['String'];
  deleteDocumentInfo: DocumentInfo;
  indexDocumentInfo: DocumentInfo;
  updateDocumentInfo: DocumentInfo;
};


export type MutationCreateDocumentInfoArgs = {
  id: Scalars['String'];
  input: CreateOrUpdateDocumentInfoInput;
  spaceId: Scalars['String'];
};


export type MutationCreateSignedUrlArgs = {
  input: CreateSignedUrlInput;
  namespace: Scalars['String'];
  spaceId: Scalars['String'];
};


export type MutationDeleteDocumentInfoArgs = {
  id: Scalars['String'];
  spaceId: Scalars['String'];
};


export type MutationIndexDocumentInfoArgs = {
  id: Scalars['String'];
  spaceId: Scalars['String'];
};


export type MutationUpdateDocumentInfoArgs = {
  id: Scalars['String'];
  input: CreateOrUpdateDocumentInfoInput;
  spaceId: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  documentInfo: DocumentInfo;
  documentInfos?: Maybe<Array<DocumentInfo>>;
};


export type QueryDocumentInfoArgs = {
  id: Scalars['String'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  CreateOrUpdateDocumentInfoInput: CreateOrUpdateDocumentInfoInput;
  CreateSignedUrlInput: CreateSignedUrlInput;
  DocumentInfo: ResolverTypeWrapper<DocumentInfo>;
  JSON: ResolverTypeWrapper<Scalars['JSON']>;
  JSONObject: ResolverTypeWrapper<Scalars['JSONObject']>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean'];
  CreateOrUpdateDocumentInfoInput: CreateOrUpdateDocumentInfoInput;
  CreateSignedUrlInput: CreateSignedUrlInput;
  DocumentInfo: DocumentInfo;
  JSON: Scalars['JSON'];
  JSONObject: Scalars['JSONObject'];
  Mutation: {};
  Query: {};
  String: Scalars['String'];
};

export type DocumentInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['DocumentInfo'] = ResolversParentTypes['DocumentInfo']> = {
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  details?: Resolver<ResolversTypes['JSONObject'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  indexed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  indexedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  namespace?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  spaceId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  xpath?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export interface JsonObjectScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSONObject'], any> {
  name: 'JSONObject';
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createDocumentInfo?: Resolver<ResolversTypes['DocumentInfo'], ParentType, ContextType, RequireFields<MutationCreateDocumentInfoArgs, 'id' | 'input' | 'spaceId'>>;
  createSignedUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationCreateSignedUrlArgs, 'input' | 'namespace' | 'spaceId'>>;
  deleteDocumentInfo?: Resolver<ResolversTypes['DocumentInfo'], ParentType, ContextType, RequireFields<MutationDeleteDocumentInfoArgs, 'id' | 'spaceId'>>;
  indexDocumentInfo?: Resolver<ResolversTypes['DocumentInfo'], ParentType, ContextType, RequireFields<MutationIndexDocumentInfoArgs, 'id' | 'spaceId'>>;
  updateDocumentInfo?: Resolver<ResolversTypes['DocumentInfo'], ParentType, ContextType, RequireFields<MutationUpdateDocumentInfoArgs, 'id' | 'input' | 'spaceId'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  documentInfo?: Resolver<ResolversTypes['DocumentInfo'], ParentType, ContextType, RequireFields<QueryDocumentInfoArgs, 'id'>>;
  documentInfos?: Resolver<Maybe<Array<ResolversTypes['DocumentInfo']>>, ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  DocumentInfo?: DocumentInfoResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  JSONObject?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
};

