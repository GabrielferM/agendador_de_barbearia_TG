
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Usuario
 * 
 */
export type Usuario = $Result.DefaultSelection<Prisma.$UsuarioPayload>
/**
 * Model Cliente
 * 
 */
export type Cliente = $Result.DefaultSelection<Prisma.$ClientePayload>
/**
 * Model Barbeiro
 * 
 */
export type Barbeiro = $Result.DefaultSelection<Prisma.$BarbeiroPayload>
/**
 * Model Filial
 * 
 */
export type Filial = $Result.DefaultSelection<Prisma.$FilialPayload>
/**
 * Model Endereco
 * 
 */
export type Endereco = $Result.DefaultSelection<Prisma.$EnderecoPayload>
/**
 * Model Servico
 * 
 */
export type Servico = $Result.DefaultSelection<Prisma.$ServicoPayload>
/**
 * Model Agendamento
 * 
 */
export type Agendamento = $Result.DefaultSelection<Prisma.$AgendamentoPayload>
/**
 * Model AgendamentoServico
 * 
 */
export type AgendamentoServico = $Result.DefaultSelection<Prisma.$AgendamentoServicoPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const TipoPerfil: {
  CLIENTE: 'CLIENTE',
  BARBEIRO: 'BARBEIRO'
};

export type TipoPerfil = (typeof TipoPerfil)[keyof typeof TipoPerfil]


export const StatusBarbeiro: {
  ATIVO: 'ATIVO',
  INATIVO: 'INATIVO'
};

export type StatusBarbeiro = (typeof StatusBarbeiro)[keyof typeof StatusBarbeiro]


export const StatusAgendamento: {
  AGENDADO: 'AGENDADO',
  CONFIRMADO: 'CONFIRMADO',
  EM_ANDAMENTO: 'EM_ANDAMENTO',
  CONCLUIDO: 'CONCLUIDO',
  CANCELADO: 'CANCELADO',
  NAO_COMPARECEU: 'NAO_COMPARECEU'
};

export type StatusAgendamento = (typeof StatusAgendamento)[keyof typeof StatusAgendamento]

}

export type TipoPerfil = $Enums.TipoPerfil

export const TipoPerfil: typeof $Enums.TipoPerfil

export type StatusBarbeiro = $Enums.StatusBarbeiro

export const StatusBarbeiro: typeof $Enums.StatusBarbeiro

export type StatusAgendamento = $Enums.StatusAgendamento

export const StatusAgendamento: typeof $Enums.StatusAgendamento

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Usuarios
 * const usuarios = await prisma.usuario.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Usuarios
   * const usuarios = await prisma.usuario.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.usuario`: Exposes CRUD operations for the **Usuario** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Usuarios
    * const usuarios = await prisma.usuario.findMany()
    * ```
    */
  get usuario(): Prisma.UsuarioDelegate<ExtArgs>;

  /**
   * `prisma.cliente`: Exposes CRUD operations for the **Cliente** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Clientes
    * const clientes = await prisma.cliente.findMany()
    * ```
    */
  get cliente(): Prisma.ClienteDelegate<ExtArgs>;

  /**
   * `prisma.barbeiro`: Exposes CRUD operations for the **Barbeiro** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Barbeiros
    * const barbeiros = await prisma.barbeiro.findMany()
    * ```
    */
  get barbeiro(): Prisma.BarbeiroDelegate<ExtArgs>;

  /**
   * `prisma.filial`: Exposes CRUD operations for the **Filial** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Filials
    * const filials = await prisma.filial.findMany()
    * ```
    */
  get filial(): Prisma.FilialDelegate<ExtArgs>;

  /**
   * `prisma.endereco`: Exposes CRUD operations for the **Endereco** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Enderecos
    * const enderecos = await prisma.endereco.findMany()
    * ```
    */
  get endereco(): Prisma.EnderecoDelegate<ExtArgs>;

  /**
   * `prisma.servico`: Exposes CRUD operations for the **Servico** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Servicos
    * const servicos = await prisma.servico.findMany()
    * ```
    */
  get servico(): Prisma.ServicoDelegate<ExtArgs>;

  /**
   * `prisma.agendamento`: Exposes CRUD operations for the **Agendamento** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Agendamentos
    * const agendamentos = await prisma.agendamento.findMany()
    * ```
    */
  get agendamento(): Prisma.AgendamentoDelegate<ExtArgs>;

  /**
   * `prisma.agendamentoServico`: Exposes CRUD operations for the **AgendamentoServico** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AgendamentoServicos
    * const agendamentoServicos = await prisma.agendamentoServico.findMany()
    * ```
    */
  get agendamentoServico(): Prisma.AgendamentoServicoDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Usuario: 'Usuario',
    Cliente: 'Cliente',
    Barbeiro: 'Barbeiro',
    Filial: 'Filial',
    Endereco: 'Endereco',
    Servico: 'Servico',
    Agendamento: 'Agendamento',
    AgendamentoServico: 'AgendamentoServico'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "usuario" | "cliente" | "barbeiro" | "filial" | "endereco" | "servico" | "agendamento" | "agendamentoServico"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Usuario: {
        payload: Prisma.$UsuarioPayload<ExtArgs>
        fields: Prisma.UsuarioFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UsuarioFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UsuarioFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          findFirst: {
            args: Prisma.UsuarioFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UsuarioFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          findMany: {
            args: Prisma.UsuarioFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>[]
          }
          create: {
            args: Prisma.UsuarioCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          createMany: {
            args: Prisma.UsuarioCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UsuarioCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>[]
          }
          delete: {
            args: Prisma.UsuarioDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          update: {
            args: Prisma.UsuarioUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          deleteMany: {
            args: Prisma.UsuarioDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UsuarioUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UsuarioUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          aggregate: {
            args: Prisma.UsuarioAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUsuario>
          }
          groupBy: {
            args: Prisma.UsuarioGroupByArgs<ExtArgs>
            result: $Utils.Optional<UsuarioGroupByOutputType>[]
          }
          count: {
            args: Prisma.UsuarioCountArgs<ExtArgs>
            result: $Utils.Optional<UsuarioCountAggregateOutputType> | number
          }
        }
      }
      Cliente: {
        payload: Prisma.$ClientePayload<ExtArgs>
        fields: Prisma.ClienteFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ClienteFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ClienteFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientePayload>
          }
          findFirst: {
            args: Prisma.ClienteFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ClienteFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientePayload>
          }
          findMany: {
            args: Prisma.ClienteFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientePayload>[]
          }
          create: {
            args: Prisma.ClienteCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientePayload>
          }
          createMany: {
            args: Prisma.ClienteCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ClienteCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientePayload>[]
          }
          delete: {
            args: Prisma.ClienteDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientePayload>
          }
          update: {
            args: Prisma.ClienteUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientePayload>
          }
          deleteMany: {
            args: Prisma.ClienteDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ClienteUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ClienteUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientePayload>
          }
          aggregate: {
            args: Prisma.ClienteAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCliente>
          }
          groupBy: {
            args: Prisma.ClienteGroupByArgs<ExtArgs>
            result: $Utils.Optional<ClienteGroupByOutputType>[]
          }
          count: {
            args: Prisma.ClienteCountArgs<ExtArgs>
            result: $Utils.Optional<ClienteCountAggregateOutputType> | number
          }
        }
      }
      Barbeiro: {
        payload: Prisma.$BarbeiroPayload<ExtArgs>
        fields: Prisma.BarbeiroFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BarbeiroFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BarbeiroPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BarbeiroFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BarbeiroPayload>
          }
          findFirst: {
            args: Prisma.BarbeiroFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BarbeiroPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BarbeiroFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BarbeiroPayload>
          }
          findMany: {
            args: Prisma.BarbeiroFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BarbeiroPayload>[]
          }
          create: {
            args: Prisma.BarbeiroCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BarbeiroPayload>
          }
          createMany: {
            args: Prisma.BarbeiroCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BarbeiroCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BarbeiroPayload>[]
          }
          delete: {
            args: Prisma.BarbeiroDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BarbeiroPayload>
          }
          update: {
            args: Prisma.BarbeiroUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BarbeiroPayload>
          }
          deleteMany: {
            args: Prisma.BarbeiroDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BarbeiroUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.BarbeiroUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BarbeiroPayload>
          }
          aggregate: {
            args: Prisma.BarbeiroAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBarbeiro>
          }
          groupBy: {
            args: Prisma.BarbeiroGroupByArgs<ExtArgs>
            result: $Utils.Optional<BarbeiroGroupByOutputType>[]
          }
          count: {
            args: Prisma.BarbeiroCountArgs<ExtArgs>
            result: $Utils.Optional<BarbeiroCountAggregateOutputType> | number
          }
        }
      }
      Filial: {
        payload: Prisma.$FilialPayload<ExtArgs>
        fields: Prisma.FilialFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FilialFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilialPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FilialFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilialPayload>
          }
          findFirst: {
            args: Prisma.FilialFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilialPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FilialFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilialPayload>
          }
          findMany: {
            args: Prisma.FilialFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilialPayload>[]
          }
          create: {
            args: Prisma.FilialCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilialPayload>
          }
          createMany: {
            args: Prisma.FilialCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FilialCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilialPayload>[]
          }
          delete: {
            args: Prisma.FilialDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilialPayload>
          }
          update: {
            args: Prisma.FilialUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilialPayload>
          }
          deleteMany: {
            args: Prisma.FilialDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FilialUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.FilialUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilialPayload>
          }
          aggregate: {
            args: Prisma.FilialAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFilial>
          }
          groupBy: {
            args: Prisma.FilialGroupByArgs<ExtArgs>
            result: $Utils.Optional<FilialGroupByOutputType>[]
          }
          count: {
            args: Prisma.FilialCountArgs<ExtArgs>
            result: $Utils.Optional<FilialCountAggregateOutputType> | number
          }
        }
      }
      Endereco: {
        payload: Prisma.$EnderecoPayload<ExtArgs>
        fields: Prisma.EnderecoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EnderecoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnderecoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EnderecoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnderecoPayload>
          }
          findFirst: {
            args: Prisma.EnderecoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnderecoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EnderecoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnderecoPayload>
          }
          findMany: {
            args: Prisma.EnderecoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnderecoPayload>[]
          }
          create: {
            args: Prisma.EnderecoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnderecoPayload>
          }
          createMany: {
            args: Prisma.EnderecoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EnderecoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnderecoPayload>[]
          }
          delete: {
            args: Prisma.EnderecoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnderecoPayload>
          }
          update: {
            args: Prisma.EnderecoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnderecoPayload>
          }
          deleteMany: {
            args: Prisma.EnderecoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EnderecoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.EnderecoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnderecoPayload>
          }
          aggregate: {
            args: Prisma.EnderecoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEndereco>
          }
          groupBy: {
            args: Prisma.EnderecoGroupByArgs<ExtArgs>
            result: $Utils.Optional<EnderecoGroupByOutputType>[]
          }
          count: {
            args: Prisma.EnderecoCountArgs<ExtArgs>
            result: $Utils.Optional<EnderecoCountAggregateOutputType> | number
          }
        }
      }
      Servico: {
        payload: Prisma.$ServicoPayload<ExtArgs>
        fields: Prisma.ServicoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ServicoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ServicoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicoPayload>
          }
          findFirst: {
            args: Prisma.ServicoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ServicoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicoPayload>
          }
          findMany: {
            args: Prisma.ServicoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicoPayload>[]
          }
          create: {
            args: Prisma.ServicoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicoPayload>
          }
          createMany: {
            args: Prisma.ServicoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ServicoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicoPayload>[]
          }
          delete: {
            args: Prisma.ServicoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicoPayload>
          }
          update: {
            args: Prisma.ServicoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicoPayload>
          }
          deleteMany: {
            args: Prisma.ServicoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ServicoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ServicoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicoPayload>
          }
          aggregate: {
            args: Prisma.ServicoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateServico>
          }
          groupBy: {
            args: Prisma.ServicoGroupByArgs<ExtArgs>
            result: $Utils.Optional<ServicoGroupByOutputType>[]
          }
          count: {
            args: Prisma.ServicoCountArgs<ExtArgs>
            result: $Utils.Optional<ServicoCountAggregateOutputType> | number
          }
        }
      }
      Agendamento: {
        payload: Prisma.$AgendamentoPayload<ExtArgs>
        fields: Prisma.AgendamentoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AgendamentoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgendamentoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AgendamentoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgendamentoPayload>
          }
          findFirst: {
            args: Prisma.AgendamentoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgendamentoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AgendamentoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgendamentoPayload>
          }
          findMany: {
            args: Prisma.AgendamentoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgendamentoPayload>[]
          }
          create: {
            args: Prisma.AgendamentoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgendamentoPayload>
          }
          createMany: {
            args: Prisma.AgendamentoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AgendamentoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgendamentoPayload>[]
          }
          delete: {
            args: Prisma.AgendamentoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgendamentoPayload>
          }
          update: {
            args: Prisma.AgendamentoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgendamentoPayload>
          }
          deleteMany: {
            args: Prisma.AgendamentoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AgendamentoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AgendamentoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgendamentoPayload>
          }
          aggregate: {
            args: Prisma.AgendamentoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAgendamento>
          }
          groupBy: {
            args: Prisma.AgendamentoGroupByArgs<ExtArgs>
            result: $Utils.Optional<AgendamentoGroupByOutputType>[]
          }
          count: {
            args: Prisma.AgendamentoCountArgs<ExtArgs>
            result: $Utils.Optional<AgendamentoCountAggregateOutputType> | number
          }
        }
      }
      AgendamentoServico: {
        payload: Prisma.$AgendamentoServicoPayload<ExtArgs>
        fields: Prisma.AgendamentoServicoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AgendamentoServicoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgendamentoServicoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AgendamentoServicoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgendamentoServicoPayload>
          }
          findFirst: {
            args: Prisma.AgendamentoServicoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgendamentoServicoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AgendamentoServicoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgendamentoServicoPayload>
          }
          findMany: {
            args: Prisma.AgendamentoServicoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgendamentoServicoPayload>[]
          }
          create: {
            args: Prisma.AgendamentoServicoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgendamentoServicoPayload>
          }
          createMany: {
            args: Prisma.AgendamentoServicoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AgendamentoServicoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgendamentoServicoPayload>[]
          }
          delete: {
            args: Prisma.AgendamentoServicoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgendamentoServicoPayload>
          }
          update: {
            args: Prisma.AgendamentoServicoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgendamentoServicoPayload>
          }
          deleteMany: {
            args: Prisma.AgendamentoServicoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AgendamentoServicoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AgendamentoServicoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgendamentoServicoPayload>
          }
          aggregate: {
            args: Prisma.AgendamentoServicoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAgendamentoServico>
          }
          groupBy: {
            args: Prisma.AgendamentoServicoGroupByArgs<ExtArgs>
            result: $Utils.Optional<AgendamentoServicoGroupByOutputType>[]
          }
          count: {
            args: Prisma.AgendamentoServicoCountArgs<ExtArgs>
            result: $Utils.Optional<AgendamentoServicoCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type ClienteCountOutputType
   */

  export type ClienteCountOutputType = {
    agendamentos: number
  }

  export type ClienteCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    agendamentos?: boolean | ClienteCountOutputTypeCountAgendamentosArgs
  }

  // Custom InputTypes
  /**
   * ClienteCountOutputType without action
   */
  export type ClienteCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClienteCountOutputType
     */
    select?: ClienteCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ClienteCountOutputType without action
   */
  export type ClienteCountOutputTypeCountAgendamentosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AgendamentoWhereInput
  }


  /**
   * Count Type BarbeiroCountOutputType
   */

  export type BarbeiroCountOutputType = {
    agendamentos: number
  }

  export type BarbeiroCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    agendamentos?: boolean | BarbeiroCountOutputTypeCountAgendamentosArgs
  }

  // Custom InputTypes
  /**
   * BarbeiroCountOutputType without action
   */
  export type BarbeiroCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BarbeiroCountOutputType
     */
    select?: BarbeiroCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * BarbeiroCountOutputType without action
   */
  export type BarbeiroCountOutputTypeCountAgendamentosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AgendamentoWhereInput
  }


  /**
   * Count Type FilialCountOutputType
   */

  export type FilialCountOutputType = {
    barbeiros: number
    agendamentos: number
  }

  export type FilialCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    barbeiros?: boolean | FilialCountOutputTypeCountBarbeirosArgs
    agendamentos?: boolean | FilialCountOutputTypeCountAgendamentosArgs
  }

  // Custom InputTypes
  /**
   * FilialCountOutputType without action
   */
  export type FilialCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FilialCountOutputType
     */
    select?: FilialCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * FilialCountOutputType without action
   */
  export type FilialCountOutputTypeCountBarbeirosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BarbeiroWhereInput
  }

  /**
   * FilialCountOutputType without action
   */
  export type FilialCountOutputTypeCountAgendamentosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AgendamentoWhereInput
  }


  /**
   * Count Type ServicoCountOutputType
   */

  export type ServicoCountOutputType = {
    agendamentos: number
  }

  export type ServicoCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    agendamentos?: boolean | ServicoCountOutputTypeCountAgendamentosArgs
  }

  // Custom InputTypes
  /**
   * ServicoCountOutputType without action
   */
  export type ServicoCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServicoCountOutputType
     */
    select?: ServicoCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ServicoCountOutputType without action
   */
  export type ServicoCountOutputTypeCountAgendamentosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AgendamentoServicoWhereInput
  }


  /**
   * Count Type AgendamentoCountOutputType
   */

  export type AgendamentoCountOutputType = {
    servicos: number
  }

  export type AgendamentoCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    servicos?: boolean | AgendamentoCountOutputTypeCountServicosArgs
  }

  // Custom InputTypes
  /**
   * AgendamentoCountOutputType without action
   */
  export type AgendamentoCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgendamentoCountOutputType
     */
    select?: AgendamentoCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AgendamentoCountOutputType without action
   */
  export type AgendamentoCountOutputTypeCountServicosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AgendamentoServicoWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Usuario
   */

  export type AggregateUsuario = {
    _count: UsuarioCountAggregateOutputType | null
    _avg: UsuarioAvgAggregateOutputType | null
    _sum: UsuarioSumAggregateOutputType | null
    _min: UsuarioMinAggregateOutputType | null
    _max: UsuarioMaxAggregateOutputType | null
  }

  export type UsuarioAvgAggregateOutputType = {
    id: number | null
  }

  export type UsuarioSumAggregateOutputType = {
    id: number | null
  }

  export type UsuarioMinAggregateOutputType = {
    id: number | null
    nome: string | null
    email: string | null
    senha: string | null
    dataCadastro: Date | null
    tipoPerfil: $Enums.TipoPerfil | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UsuarioMaxAggregateOutputType = {
    id: number | null
    nome: string | null
    email: string | null
    senha: string | null
    dataCadastro: Date | null
    tipoPerfil: $Enums.TipoPerfil | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UsuarioCountAggregateOutputType = {
    id: number
    nome: number
    email: number
    senha: number
    dataCadastro: number
    tipoPerfil: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UsuarioAvgAggregateInputType = {
    id?: true
  }

  export type UsuarioSumAggregateInputType = {
    id?: true
  }

  export type UsuarioMinAggregateInputType = {
    id?: true
    nome?: true
    email?: true
    senha?: true
    dataCadastro?: true
    tipoPerfil?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UsuarioMaxAggregateInputType = {
    id?: true
    nome?: true
    email?: true
    senha?: true
    dataCadastro?: true
    tipoPerfil?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UsuarioCountAggregateInputType = {
    id?: true
    nome?: true
    email?: true
    senha?: true
    dataCadastro?: true
    tipoPerfil?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UsuarioAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Usuario to aggregate.
     */
    where?: UsuarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Usuarios to fetch.
     */
    orderBy?: UsuarioOrderByWithRelationInput | UsuarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UsuarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Usuarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Usuarios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Usuarios
    **/
    _count?: true | UsuarioCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UsuarioAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UsuarioSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UsuarioMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UsuarioMaxAggregateInputType
  }

  export type GetUsuarioAggregateType<T extends UsuarioAggregateArgs> = {
        [P in keyof T & keyof AggregateUsuario]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUsuario[P]>
      : GetScalarType<T[P], AggregateUsuario[P]>
  }




  export type UsuarioGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UsuarioWhereInput
    orderBy?: UsuarioOrderByWithAggregationInput | UsuarioOrderByWithAggregationInput[]
    by: UsuarioScalarFieldEnum[] | UsuarioScalarFieldEnum
    having?: UsuarioScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UsuarioCountAggregateInputType | true
    _avg?: UsuarioAvgAggregateInputType
    _sum?: UsuarioSumAggregateInputType
    _min?: UsuarioMinAggregateInputType
    _max?: UsuarioMaxAggregateInputType
  }

  export type UsuarioGroupByOutputType = {
    id: number
    nome: string
    email: string
    senha: string
    dataCadastro: Date
    tipoPerfil: $Enums.TipoPerfil
    createdAt: Date
    updatedAt: Date
    _count: UsuarioCountAggregateOutputType | null
    _avg: UsuarioAvgAggregateOutputType | null
    _sum: UsuarioSumAggregateOutputType | null
    _min: UsuarioMinAggregateOutputType | null
    _max: UsuarioMaxAggregateOutputType | null
  }

  type GetUsuarioGroupByPayload<T extends UsuarioGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UsuarioGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UsuarioGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UsuarioGroupByOutputType[P]>
            : GetScalarType<T[P], UsuarioGroupByOutputType[P]>
        }
      >
    >


  export type UsuarioSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    email?: boolean
    senha?: boolean
    dataCadastro?: boolean
    tipoPerfil?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    cliente?: boolean | Usuario$clienteArgs<ExtArgs>
    barbeiro?: boolean | Usuario$barbeiroArgs<ExtArgs>
  }, ExtArgs["result"]["usuario"]>

  export type UsuarioSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    email?: boolean
    senha?: boolean
    dataCadastro?: boolean
    tipoPerfil?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["usuario"]>

  export type UsuarioSelectScalar = {
    id?: boolean
    nome?: boolean
    email?: boolean
    senha?: boolean
    dataCadastro?: boolean
    tipoPerfil?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UsuarioInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cliente?: boolean | Usuario$clienteArgs<ExtArgs>
    barbeiro?: boolean | Usuario$barbeiroArgs<ExtArgs>
  }
  export type UsuarioIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UsuarioPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Usuario"
    objects: {
      cliente: Prisma.$ClientePayload<ExtArgs> | null
      barbeiro: Prisma.$BarbeiroPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      nome: string
      email: string
      senha: string
      dataCadastro: Date
      tipoPerfil: $Enums.TipoPerfil
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["usuario"]>
    composites: {}
  }

  type UsuarioGetPayload<S extends boolean | null | undefined | UsuarioDefaultArgs> = $Result.GetResult<Prisma.$UsuarioPayload, S>

  type UsuarioCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UsuarioFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UsuarioCountAggregateInputType | true
    }

  export interface UsuarioDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Usuario'], meta: { name: 'Usuario' } }
    /**
     * Find zero or one Usuario that matches the filter.
     * @param {UsuarioFindUniqueArgs} args - Arguments to find a Usuario
     * @example
     * // Get one Usuario
     * const usuario = await prisma.usuario.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UsuarioFindUniqueArgs>(args: SelectSubset<T, UsuarioFindUniqueArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Usuario that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UsuarioFindUniqueOrThrowArgs} args - Arguments to find a Usuario
     * @example
     * // Get one Usuario
     * const usuario = await prisma.usuario.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UsuarioFindUniqueOrThrowArgs>(args: SelectSubset<T, UsuarioFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Usuario that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioFindFirstArgs} args - Arguments to find a Usuario
     * @example
     * // Get one Usuario
     * const usuario = await prisma.usuario.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UsuarioFindFirstArgs>(args?: SelectSubset<T, UsuarioFindFirstArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Usuario that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioFindFirstOrThrowArgs} args - Arguments to find a Usuario
     * @example
     * // Get one Usuario
     * const usuario = await prisma.usuario.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UsuarioFindFirstOrThrowArgs>(args?: SelectSubset<T, UsuarioFindFirstOrThrowArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Usuarios that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Usuarios
     * const usuarios = await prisma.usuario.findMany()
     * 
     * // Get first 10 Usuarios
     * const usuarios = await prisma.usuario.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const usuarioWithIdOnly = await prisma.usuario.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UsuarioFindManyArgs>(args?: SelectSubset<T, UsuarioFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Usuario.
     * @param {UsuarioCreateArgs} args - Arguments to create a Usuario.
     * @example
     * // Create one Usuario
     * const Usuario = await prisma.usuario.create({
     *   data: {
     *     // ... data to create a Usuario
     *   }
     * })
     * 
     */
    create<T extends UsuarioCreateArgs>(args: SelectSubset<T, UsuarioCreateArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Usuarios.
     * @param {UsuarioCreateManyArgs} args - Arguments to create many Usuarios.
     * @example
     * // Create many Usuarios
     * const usuario = await prisma.usuario.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UsuarioCreateManyArgs>(args?: SelectSubset<T, UsuarioCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Usuarios and returns the data saved in the database.
     * @param {UsuarioCreateManyAndReturnArgs} args - Arguments to create many Usuarios.
     * @example
     * // Create many Usuarios
     * const usuario = await prisma.usuario.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Usuarios and only return the `id`
     * const usuarioWithIdOnly = await prisma.usuario.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UsuarioCreateManyAndReturnArgs>(args?: SelectSubset<T, UsuarioCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Usuario.
     * @param {UsuarioDeleteArgs} args - Arguments to delete one Usuario.
     * @example
     * // Delete one Usuario
     * const Usuario = await prisma.usuario.delete({
     *   where: {
     *     // ... filter to delete one Usuario
     *   }
     * })
     * 
     */
    delete<T extends UsuarioDeleteArgs>(args: SelectSubset<T, UsuarioDeleteArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Usuario.
     * @param {UsuarioUpdateArgs} args - Arguments to update one Usuario.
     * @example
     * // Update one Usuario
     * const usuario = await prisma.usuario.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UsuarioUpdateArgs>(args: SelectSubset<T, UsuarioUpdateArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Usuarios.
     * @param {UsuarioDeleteManyArgs} args - Arguments to filter Usuarios to delete.
     * @example
     * // Delete a few Usuarios
     * const { count } = await prisma.usuario.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UsuarioDeleteManyArgs>(args?: SelectSubset<T, UsuarioDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Usuarios.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Usuarios
     * const usuario = await prisma.usuario.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UsuarioUpdateManyArgs>(args: SelectSubset<T, UsuarioUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Usuario.
     * @param {UsuarioUpsertArgs} args - Arguments to update or create a Usuario.
     * @example
     * // Update or create a Usuario
     * const usuario = await prisma.usuario.upsert({
     *   create: {
     *     // ... data to create a Usuario
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Usuario we want to update
     *   }
     * })
     */
    upsert<T extends UsuarioUpsertArgs>(args: SelectSubset<T, UsuarioUpsertArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Usuarios.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioCountArgs} args - Arguments to filter Usuarios to count.
     * @example
     * // Count the number of Usuarios
     * const count = await prisma.usuario.count({
     *   where: {
     *     // ... the filter for the Usuarios we want to count
     *   }
     * })
    **/
    count<T extends UsuarioCountArgs>(
      args?: Subset<T, UsuarioCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UsuarioCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Usuario.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UsuarioAggregateArgs>(args: Subset<T, UsuarioAggregateArgs>): Prisma.PrismaPromise<GetUsuarioAggregateType<T>>

    /**
     * Group by Usuario.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UsuarioGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UsuarioGroupByArgs['orderBy'] }
        : { orderBy?: UsuarioGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UsuarioGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUsuarioGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Usuario model
   */
  readonly fields: UsuarioFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Usuario.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UsuarioClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    cliente<T extends Usuario$clienteArgs<ExtArgs> = {}>(args?: Subset<T, Usuario$clienteArgs<ExtArgs>>): Prisma__ClienteClient<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    barbeiro<T extends Usuario$barbeiroArgs<ExtArgs> = {}>(args?: Subset<T, Usuario$barbeiroArgs<ExtArgs>>): Prisma__BarbeiroClient<$Result.GetResult<Prisma.$BarbeiroPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Usuario model
   */ 
  interface UsuarioFieldRefs {
    readonly id: FieldRef<"Usuario", 'Int'>
    readonly nome: FieldRef<"Usuario", 'String'>
    readonly email: FieldRef<"Usuario", 'String'>
    readonly senha: FieldRef<"Usuario", 'String'>
    readonly dataCadastro: FieldRef<"Usuario", 'DateTime'>
    readonly tipoPerfil: FieldRef<"Usuario", 'TipoPerfil'>
    readonly createdAt: FieldRef<"Usuario", 'DateTime'>
    readonly updatedAt: FieldRef<"Usuario", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Usuario findUnique
   */
  export type UsuarioFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * Filter, which Usuario to fetch.
     */
    where: UsuarioWhereUniqueInput
  }

  /**
   * Usuario findUniqueOrThrow
   */
  export type UsuarioFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * Filter, which Usuario to fetch.
     */
    where: UsuarioWhereUniqueInput
  }

  /**
   * Usuario findFirst
   */
  export type UsuarioFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * Filter, which Usuario to fetch.
     */
    where?: UsuarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Usuarios to fetch.
     */
    orderBy?: UsuarioOrderByWithRelationInput | UsuarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Usuarios.
     */
    cursor?: UsuarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Usuarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Usuarios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Usuarios.
     */
    distinct?: UsuarioScalarFieldEnum | UsuarioScalarFieldEnum[]
  }

  /**
   * Usuario findFirstOrThrow
   */
  export type UsuarioFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * Filter, which Usuario to fetch.
     */
    where?: UsuarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Usuarios to fetch.
     */
    orderBy?: UsuarioOrderByWithRelationInput | UsuarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Usuarios.
     */
    cursor?: UsuarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Usuarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Usuarios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Usuarios.
     */
    distinct?: UsuarioScalarFieldEnum | UsuarioScalarFieldEnum[]
  }

  /**
   * Usuario findMany
   */
  export type UsuarioFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * Filter, which Usuarios to fetch.
     */
    where?: UsuarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Usuarios to fetch.
     */
    orderBy?: UsuarioOrderByWithRelationInput | UsuarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Usuarios.
     */
    cursor?: UsuarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Usuarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Usuarios.
     */
    skip?: number
    distinct?: UsuarioScalarFieldEnum | UsuarioScalarFieldEnum[]
  }

  /**
   * Usuario create
   */
  export type UsuarioCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * The data needed to create a Usuario.
     */
    data: XOR<UsuarioCreateInput, UsuarioUncheckedCreateInput>
  }

  /**
   * Usuario createMany
   */
  export type UsuarioCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Usuarios.
     */
    data: UsuarioCreateManyInput | UsuarioCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Usuario createManyAndReturn
   */
  export type UsuarioCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Usuarios.
     */
    data: UsuarioCreateManyInput | UsuarioCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Usuario update
   */
  export type UsuarioUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * The data needed to update a Usuario.
     */
    data: XOR<UsuarioUpdateInput, UsuarioUncheckedUpdateInput>
    /**
     * Choose, which Usuario to update.
     */
    where: UsuarioWhereUniqueInput
  }

  /**
   * Usuario updateMany
   */
  export type UsuarioUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Usuarios.
     */
    data: XOR<UsuarioUpdateManyMutationInput, UsuarioUncheckedUpdateManyInput>
    /**
     * Filter which Usuarios to update
     */
    where?: UsuarioWhereInput
  }

  /**
   * Usuario upsert
   */
  export type UsuarioUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * The filter to search for the Usuario to update in case it exists.
     */
    where: UsuarioWhereUniqueInput
    /**
     * In case the Usuario found by the `where` argument doesn't exist, create a new Usuario with this data.
     */
    create: XOR<UsuarioCreateInput, UsuarioUncheckedCreateInput>
    /**
     * In case the Usuario was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UsuarioUpdateInput, UsuarioUncheckedUpdateInput>
  }

  /**
   * Usuario delete
   */
  export type UsuarioDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * Filter which Usuario to delete.
     */
    where: UsuarioWhereUniqueInput
  }

  /**
   * Usuario deleteMany
   */
  export type UsuarioDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Usuarios to delete
     */
    where?: UsuarioWhereInput
  }

  /**
   * Usuario.cliente
   */
  export type Usuario$clienteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: ClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClienteInclude<ExtArgs> | null
    where?: ClienteWhereInput
  }

  /**
   * Usuario.barbeiro
   */
  export type Usuario$barbeiroArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Barbeiro
     */
    select?: BarbeiroSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BarbeiroInclude<ExtArgs> | null
    where?: BarbeiroWhereInput
  }

  /**
   * Usuario without action
   */
  export type UsuarioDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
  }


  /**
   * Model Cliente
   */

  export type AggregateCliente = {
    _count: ClienteCountAggregateOutputType | null
    _avg: ClienteAvgAggregateOutputType | null
    _sum: ClienteSumAggregateOutputType | null
    _min: ClienteMinAggregateOutputType | null
    _max: ClienteMaxAggregateOutputType | null
  }

  export type ClienteAvgAggregateOutputType = {
    id: number | null
  }

  export type ClienteSumAggregateOutputType = {
    id: number | null
  }

  export type ClienteMinAggregateOutputType = {
    id: number | null
    cpf: string | null
    dataNascimento: Date | null
  }

  export type ClienteMaxAggregateOutputType = {
    id: number | null
    cpf: string | null
    dataNascimento: Date | null
  }

  export type ClienteCountAggregateOutputType = {
    id: number
    cpf: number
    dataNascimento: number
    _all: number
  }


  export type ClienteAvgAggregateInputType = {
    id?: true
  }

  export type ClienteSumAggregateInputType = {
    id?: true
  }

  export type ClienteMinAggregateInputType = {
    id?: true
    cpf?: true
    dataNascimento?: true
  }

  export type ClienteMaxAggregateInputType = {
    id?: true
    cpf?: true
    dataNascimento?: true
  }

  export type ClienteCountAggregateInputType = {
    id?: true
    cpf?: true
    dataNascimento?: true
    _all?: true
  }

  export type ClienteAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Cliente to aggregate.
     */
    where?: ClienteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clientes to fetch.
     */
    orderBy?: ClienteOrderByWithRelationInput | ClienteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ClienteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clientes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clientes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Clientes
    **/
    _count?: true | ClienteCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ClienteAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ClienteSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ClienteMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ClienteMaxAggregateInputType
  }

  export type GetClienteAggregateType<T extends ClienteAggregateArgs> = {
        [P in keyof T & keyof AggregateCliente]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCliente[P]>
      : GetScalarType<T[P], AggregateCliente[P]>
  }




  export type ClienteGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClienteWhereInput
    orderBy?: ClienteOrderByWithAggregationInput | ClienteOrderByWithAggregationInput[]
    by: ClienteScalarFieldEnum[] | ClienteScalarFieldEnum
    having?: ClienteScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ClienteCountAggregateInputType | true
    _avg?: ClienteAvgAggregateInputType
    _sum?: ClienteSumAggregateInputType
    _min?: ClienteMinAggregateInputType
    _max?: ClienteMaxAggregateInputType
  }

  export type ClienteGroupByOutputType = {
    id: number
    cpf: string
    dataNascimento: Date | null
    _count: ClienteCountAggregateOutputType | null
    _avg: ClienteAvgAggregateOutputType | null
    _sum: ClienteSumAggregateOutputType | null
    _min: ClienteMinAggregateOutputType | null
    _max: ClienteMaxAggregateOutputType | null
  }

  type GetClienteGroupByPayload<T extends ClienteGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ClienteGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ClienteGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ClienteGroupByOutputType[P]>
            : GetScalarType<T[P], ClienteGroupByOutputType[P]>
        }
      >
    >


  export type ClienteSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cpf?: boolean
    dataNascimento?: boolean
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
    agendamentos?: boolean | Cliente$agendamentosArgs<ExtArgs>
    _count?: boolean | ClienteCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cliente"]>

  export type ClienteSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cpf?: boolean
    dataNascimento?: boolean
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cliente"]>

  export type ClienteSelectScalar = {
    id?: boolean
    cpf?: boolean
    dataNascimento?: boolean
  }

  export type ClienteInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
    agendamentos?: boolean | Cliente$agendamentosArgs<ExtArgs>
    _count?: boolean | ClienteCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ClienteIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
  }

  export type $ClientePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Cliente"
    objects: {
      usuario: Prisma.$UsuarioPayload<ExtArgs>
      agendamentos: Prisma.$AgendamentoPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      cpf: string
      dataNascimento: Date | null
    }, ExtArgs["result"]["cliente"]>
    composites: {}
  }

  type ClienteGetPayload<S extends boolean | null | undefined | ClienteDefaultArgs> = $Result.GetResult<Prisma.$ClientePayload, S>

  type ClienteCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ClienteFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ClienteCountAggregateInputType | true
    }

  export interface ClienteDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Cliente'], meta: { name: 'Cliente' } }
    /**
     * Find zero or one Cliente that matches the filter.
     * @param {ClienteFindUniqueArgs} args - Arguments to find a Cliente
     * @example
     * // Get one Cliente
     * const cliente = await prisma.cliente.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ClienteFindUniqueArgs>(args: SelectSubset<T, ClienteFindUniqueArgs<ExtArgs>>): Prisma__ClienteClient<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Cliente that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ClienteFindUniqueOrThrowArgs} args - Arguments to find a Cliente
     * @example
     * // Get one Cliente
     * const cliente = await prisma.cliente.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ClienteFindUniqueOrThrowArgs>(args: SelectSubset<T, ClienteFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ClienteClient<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Cliente that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClienteFindFirstArgs} args - Arguments to find a Cliente
     * @example
     * // Get one Cliente
     * const cliente = await prisma.cliente.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ClienteFindFirstArgs>(args?: SelectSubset<T, ClienteFindFirstArgs<ExtArgs>>): Prisma__ClienteClient<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Cliente that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClienteFindFirstOrThrowArgs} args - Arguments to find a Cliente
     * @example
     * // Get one Cliente
     * const cliente = await prisma.cliente.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ClienteFindFirstOrThrowArgs>(args?: SelectSubset<T, ClienteFindFirstOrThrowArgs<ExtArgs>>): Prisma__ClienteClient<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Clientes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClienteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Clientes
     * const clientes = await prisma.cliente.findMany()
     * 
     * // Get first 10 Clientes
     * const clientes = await prisma.cliente.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const clienteWithIdOnly = await prisma.cliente.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ClienteFindManyArgs>(args?: SelectSubset<T, ClienteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Cliente.
     * @param {ClienteCreateArgs} args - Arguments to create a Cliente.
     * @example
     * // Create one Cliente
     * const Cliente = await prisma.cliente.create({
     *   data: {
     *     // ... data to create a Cliente
     *   }
     * })
     * 
     */
    create<T extends ClienteCreateArgs>(args: SelectSubset<T, ClienteCreateArgs<ExtArgs>>): Prisma__ClienteClient<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Clientes.
     * @param {ClienteCreateManyArgs} args - Arguments to create many Clientes.
     * @example
     * // Create many Clientes
     * const cliente = await prisma.cliente.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ClienteCreateManyArgs>(args?: SelectSubset<T, ClienteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Clientes and returns the data saved in the database.
     * @param {ClienteCreateManyAndReturnArgs} args - Arguments to create many Clientes.
     * @example
     * // Create many Clientes
     * const cliente = await prisma.cliente.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Clientes and only return the `id`
     * const clienteWithIdOnly = await prisma.cliente.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ClienteCreateManyAndReturnArgs>(args?: SelectSubset<T, ClienteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Cliente.
     * @param {ClienteDeleteArgs} args - Arguments to delete one Cliente.
     * @example
     * // Delete one Cliente
     * const Cliente = await prisma.cliente.delete({
     *   where: {
     *     // ... filter to delete one Cliente
     *   }
     * })
     * 
     */
    delete<T extends ClienteDeleteArgs>(args: SelectSubset<T, ClienteDeleteArgs<ExtArgs>>): Prisma__ClienteClient<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Cliente.
     * @param {ClienteUpdateArgs} args - Arguments to update one Cliente.
     * @example
     * // Update one Cliente
     * const cliente = await prisma.cliente.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ClienteUpdateArgs>(args: SelectSubset<T, ClienteUpdateArgs<ExtArgs>>): Prisma__ClienteClient<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Clientes.
     * @param {ClienteDeleteManyArgs} args - Arguments to filter Clientes to delete.
     * @example
     * // Delete a few Clientes
     * const { count } = await prisma.cliente.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ClienteDeleteManyArgs>(args?: SelectSubset<T, ClienteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Clientes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClienteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Clientes
     * const cliente = await prisma.cliente.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ClienteUpdateManyArgs>(args: SelectSubset<T, ClienteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Cliente.
     * @param {ClienteUpsertArgs} args - Arguments to update or create a Cliente.
     * @example
     * // Update or create a Cliente
     * const cliente = await prisma.cliente.upsert({
     *   create: {
     *     // ... data to create a Cliente
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Cliente we want to update
     *   }
     * })
     */
    upsert<T extends ClienteUpsertArgs>(args: SelectSubset<T, ClienteUpsertArgs<ExtArgs>>): Prisma__ClienteClient<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Clientes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClienteCountArgs} args - Arguments to filter Clientes to count.
     * @example
     * // Count the number of Clientes
     * const count = await prisma.cliente.count({
     *   where: {
     *     // ... the filter for the Clientes we want to count
     *   }
     * })
    **/
    count<T extends ClienteCountArgs>(
      args?: Subset<T, ClienteCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ClienteCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Cliente.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClienteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ClienteAggregateArgs>(args: Subset<T, ClienteAggregateArgs>): Prisma.PrismaPromise<GetClienteAggregateType<T>>

    /**
     * Group by Cliente.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClienteGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ClienteGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ClienteGroupByArgs['orderBy'] }
        : { orderBy?: ClienteGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ClienteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetClienteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Cliente model
   */
  readonly fields: ClienteFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Cliente.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ClienteClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    usuario<T extends UsuarioDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UsuarioDefaultArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    agendamentos<T extends Cliente$agendamentosArgs<ExtArgs> = {}>(args?: Subset<T, Cliente$agendamentosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgendamentoPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Cliente model
   */ 
  interface ClienteFieldRefs {
    readonly id: FieldRef<"Cliente", 'Int'>
    readonly cpf: FieldRef<"Cliente", 'String'>
    readonly dataNascimento: FieldRef<"Cliente", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Cliente findUnique
   */
  export type ClienteFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: ClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClienteInclude<ExtArgs> | null
    /**
     * Filter, which Cliente to fetch.
     */
    where: ClienteWhereUniqueInput
  }

  /**
   * Cliente findUniqueOrThrow
   */
  export type ClienteFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: ClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClienteInclude<ExtArgs> | null
    /**
     * Filter, which Cliente to fetch.
     */
    where: ClienteWhereUniqueInput
  }

  /**
   * Cliente findFirst
   */
  export type ClienteFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: ClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClienteInclude<ExtArgs> | null
    /**
     * Filter, which Cliente to fetch.
     */
    where?: ClienteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clientes to fetch.
     */
    orderBy?: ClienteOrderByWithRelationInput | ClienteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Clientes.
     */
    cursor?: ClienteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clientes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clientes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Clientes.
     */
    distinct?: ClienteScalarFieldEnum | ClienteScalarFieldEnum[]
  }

  /**
   * Cliente findFirstOrThrow
   */
  export type ClienteFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: ClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClienteInclude<ExtArgs> | null
    /**
     * Filter, which Cliente to fetch.
     */
    where?: ClienteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clientes to fetch.
     */
    orderBy?: ClienteOrderByWithRelationInput | ClienteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Clientes.
     */
    cursor?: ClienteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clientes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clientes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Clientes.
     */
    distinct?: ClienteScalarFieldEnum | ClienteScalarFieldEnum[]
  }

  /**
   * Cliente findMany
   */
  export type ClienteFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: ClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClienteInclude<ExtArgs> | null
    /**
     * Filter, which Clientes to fetch.
     */
    where?: ClienteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clientes to fetch.
     */
    orderBy?: ClienteOrderByWithRelationInput | ClienteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Clientes.
     */
    cursor?: ClienteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clientes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clientes.
     */
    skip?: number
    distinct?: ClienteScalarFieldEnum | ClienteScalarFieldEnum[]
  }

  /**
   * Cliente create
   */
  export type ClienteCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: ClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClienteInclude<ExtArgs> | null
    /**
     * The data needed to create a Cliente.
     */
    data: XOR<ClienteCreateInput, ClienteUncheckedCreateInput>
  }

  /**
   * Cliente createMany
   */
  export type ClienteCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Clientes.
     */
    data: ClienteCreateManyInput | ClienteCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Cliente createManyAndReturn
   */
  export type ClienteCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: ClienteSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Clientes.
     */
    data: ClienteCreateManyInput | ClienteCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClienteIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Cliente update
   */
  export type ClienteUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: ClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClienteInclude<ExtArgs> | null
    /**
     * The data needed to update a Cliente.
     */
    data: XOR<ClienteUpdateInput, ClienteUncheckedUpdateInput>
    /**
     * Choose, which Cliente to update.
     */
    where: ClienteWhereUniqueInput
  }

  /**
   * Cliente updateMany
   */
  export type ClienteUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Clientes.
     */
    data: XOR<ClienteUpdateManyMutationInput, ClienteUncheckedUpdateManyInput>
    /**
     * Filter which Clientes to update
     */
    where?: ClienteWhereInput
  }

  /**
   * Cliente upsert
   */
  export type ClienteUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: ClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClienteInclude<ExtArgs> | null
    /**
     * The filter to search for the Cliente to update in case it exists.
     */
    where: ClienteWhereUniqueInput
    /**
     * In case the Cliente found by the `where` argument doesn't exist, create a new Cliente with this data.
     */
    create: XOR<ClienteCreateInput, ClienteUncheckedCreateInput>
    /**
     * In case the Cliente was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ClienteUpdateInput, ClienteUncheckedUpdateInput>
  }

  /**
   * Cliente delete
   */
  export type ClienteDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: ClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClienteInclude<ExtArgs> | null
    /**
     * Filter which Cliente to delete.
     */
    where: ClienteWhereUniqueInput
  }

  /**
   * Cliente deleteMany
   */
  export type ClienteDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Clientes to delete
     */
    where?: ClienteWhereInput
  }

  /**
   * Cliente.agendamentos
   */
  export type Cliente$agendamentosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Agendamento
     */
    select?: AgendamentoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgendamentoInclude<ExtArgs> | null
    where?: AgendamentoWhereInput
    orderBy?: AgendamentoOrderByWithRelationInput | AgendamentoOrderByWithRelationInput[]
    cursor?: AgendamentoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AgendamentoScalarFieldEnum | AgendamentoScalarFieldEnum[]
  }

  /**
   * Cliente without action
   */
  export type ClienteDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: ClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClienteInclude<ExtArgs> | null
  }


  /**
   * Model Barbeiro
   */

  export type AggregateBarbeiro = {
    _count: BarbeiroCountAggregateOutputType | null
    _avg: BarbeiroAvgAggregateOutputType | null
    _sum: BarbeiroSumAggregateOutputType | null
    _min: BarbeiroMinAggregateOutputType | null
    _max: BarbeiroMaxAggregateOutputType | null
  }

  export type BarbeiroAvgAggregateOutputType = {
    id: number | null
    idFilial: number | null
  }

  export type BarbeiroSumAggregateOutputType = {
    id: number | null
    idFilial: number | null
  }

  export type BarbeiroMinAggregateOutputType = {
    id: number | null
    descricao: string | null
    dataAdmissao: Date | null
    status: $Enums.StatusBarbeiro | null
    idFilial: number | null
  }

  export type BarbeiroMaxAggregateOutputType = {
    id: number | null
    descricao: string | null
    dataAdmissao: Date | null
    status: $Enums.StatusBarbeiro | null
    idFilial: number | null
  }

  export type BarbeiroCountAggregateOutputType = {
    id: number
    descricao: number
    dataAdmissao: number
    status: number
    idFilial: number
    _all: number
  }


  export type BarbeiroAvgAggregateInputType = {
    id?: true
    idFilial?: true
  }

  export type BarbeiroSumAggregateInputType = {
    id?: true
    idFilial?: true
  }

  export type BarbeiroMinAggregateInputType = {
    id?: true
    descricao?: true
    dataAdmissao?: true
    status?: true
    idFilial?: true
  }

  export type BarbeiroMaxAggregateInputType = {
    id?: true
    descricao?: true
    dataAdmissao?: true
    status?: true
    idFilial?: true
  }

  export type BarbeiroCountAggregateInputType = {
    id?: true
    descricao?: true
    dataAdmissao?: true
    status?: true
    idFilial?: true
    _all?: true
  }

  export type BarbeiroAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Barbeiro to aggregate.
     */
    where?: BarbeiroWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Barbeiros to fetch.
     */
    orderBy?: BarbeiroOrderByWithRelationInput | BarbeiroOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BarbeiroWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Barbeiros from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Barbeiros.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Barbeiros
    **/
    _count?: true | BarbeiroCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BarbeiroAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BarbeiroSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BarbeiroMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BarbeiroMaxAggregateInputType
  }

  export type GetBarbeiroAggregateType<T extends BarbeiroAggregateArgs> = {
        [P in keyof T & keyof AggregateBarbeiro]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBarbeiro[P]>
      : GetScalarType<T[P], AggregateBarbeiro[P]>
  }




  export type BarbeiroGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BarbeiroWhereInput
    orderBy?: BarbeiroOrderByWithAggregationInput | BarbeiroOrderByWithAggregationInput[]
    by: BarbeiroScalarFieldEnum[] | BarbeiroScalarFieldEnum
    having?: BarbeiroScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BarbeiroCountAggregateInputType | true
    _avg?: BarbeiroAvgAggregateInputType
    _sum?: BarbeiroSumAggregateInputType
    _min?: BarbeiroMinAggregateInputType
    _max?: BarbeiroMaxAggregateInputType
  }

  export type BarbeiroGroupByOutputType = {
    id: number
    descricao: string | null
    dataAdmissao: Date | null
    status: $Enums.StatusBarbeiro
    idFilial: number
    _count: BarbeiroCountAggregateOutputType | null
    _avg: BarbeiroAvgAggregateOutputType | null
    _sum: BarbeiroSumAggregateOutputType | null
    _min: BarbeiroMinAggregateOutputType | null
    _max: BarbeiroMaxAggregateOutputType | null
  }

  type GetBarbeiroGroupByPayload<T extends BarbeiroGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BarbeiroGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BarbeiroGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BarbeiroGroupByOutputType[P]>
            : GetScalarType<T[P], BarbeiroGroupByOutputType[P]>
        }
      >
    >


  export type BarbeiroSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    descricao?: boolean
    dataAdmissao?: boolean
    status?: boolean
    idFilial?: boolean
    filial?: boolean | FilialDefaultArgs<ExtArgs>
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
    agendamentos?: boolean | Barbeiro$agendamentosArgs<ExtArgs>
    _count?: boolean | BarbeiroCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["barbeiro"]>

  export type BarbeiroSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    descricao?: boolean
    dataAdmissao?: boolean
    status?: boolean
    idFilial?: boolean
    filial?: boolean | FilialDefaultArgs<ExtArgs>
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["barbeiro"]>

  export type BarbeiroSelectScalar = {
    id?: boolean
    descricao?: boolean
    dataAdmissao?: boolean
    status?: boolean
    idFilial?: boolean
  }

  export type BarbeiroInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    filial?: boolean | FilialDefaultArgs<ExtArgs>
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
    agendamentos?: boolean | Barbeiro$agendamentosArgs<ExtArgs>
    _count?: boolean | BarbeiroCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type BarbeiroIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    filial?: boolean | FilialDefaultArgs<ExtArgs>
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
  }

  export type $BarbeiroPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Barbeiro"
    objects: {
      filial: Prisma.$FilialPayload<ExtArgs>
      usuario: Prisma.$UsuarioPayload<ExtArgs>
      agendamentos: Prisma.$AgendamentoPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      descricao: string | null
      dataAdmissao: Date | null
      status: $Enums.StatusBarbeiro
      idFilial: number
    }, ExtArgs["result"]["barbeiro"]>
    composites: {}
  }

  type BarbeiroGetPayload<S extends boolean | null | undefined | BarbeiroDefaultArgs> = $Result.GetResult<Prisma.$BarbeiroPayload, S>

  type BarbeiroCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<BarbeiroFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: BarbeiroCountAggregateInputType | true
    }

  export interface BarbeiroDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Barbeiro'], meta: { name: 'Barbeiro' } }
    /**
     * Find zero or one Barbeiro that matches the filter.
     * @param {BarbeiroFindUniqueArgs} args - Arguments to find a Barbeiro
     * @example
     * // Get one Barbeiro
     * const barbeiro = await prisma.barbeiro.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BarbeiroFindUniqueArgs>(args: SelectSubset<T, BarbeiroFindUniqueArgs<ExtArgs>>): Prisma__BarbeiroClient<$Result.GetResult<Prisma.$BarbeiroPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Barbeiro that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {BarbeiroFindUniqueOrThrowArgs} args - Arguments to find a Barbeiro
     * @example
     * // Get one Barbeiro
     * const barbeiro = await prisma.barbeiro.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BarbeiroFindUniqueOrThrowArgs>(args: SelectSubset<T, BarbeiroFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BarbeiroClient<$Result.GetResult<Prisma.$BarbeiroPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Barbeiro that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BarbeiroFindFirstArgs} args - Arguments to find a Barbeiro
     * @example
     * // Get one Barbeiro
     * const barbeiro = await prisma.barbeiro.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BarbeiroFindFirstArgs>(args?: SelectSubset<T, BarbeiroFindFirstArgs<ExtArgs>>): Prisma__BarbeiroClient<$Result.GetResult<Prisma.$BarbeiroPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Barbeiro that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BarbeiroFindFirstOrThrowArgs} args - Arguments to find a Barbeiro
     * @example
     * // Get one Barbeiro
     * const barbeiro = await prisma.barbeiro.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BarbeiroFindFirstOrThrowArgs>(args?: SelectSubset<T, BarbeiroFindFirstOrThrowArgs<ExtArgs>>): Prisma__BarbeiroClient<$Result.GetResult<Prisma.$BarbeiroPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Barbeiros that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BarbeiroFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Barbeiros
     * const barbeiros = await prisma.barbeiro.findMany()
     * 
     * // Get first 10 Barbeiros
     * const barbeiros = await prisma.barbeiro.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const barbeiroWithIdOnly = await prisma.barbeiro.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BarbeiroFindManyArgs>(args?: SelectSubset<T, BarbeiroFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BarbeiroPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Barbeiro.
     * @param {BarbeiroCreateArgs} args - Arguments to create a Barbeiro.
     * @example
     * // Create one Barbeiro
     * const Barbeiro = await prisma.barbeiro.create({
     *   data: {
     *     // ... data to create a Barbeiro
     *   }
     * })
     * 
     */
    create<T extends BarbeiroCreateArgs>(args: SelectSubset<T, BarbeiroCreateArgs<ExtArgs>>): Prisma__BarbeiroClient<$Result.GetResult<Prisma.$BarbeiroPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Barbeiros.
     * @param {BarbeiroCreateManyArgs} args - Arguments to create many Barbeiros.
     * @example
     * // Create many Barbeiros
     * const barbeiro = await prisma.barbeiro.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BarbeiroCreateManyArgs>(args?: SelectSubset<T, BarbeiroCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Barbeiros and returns the data saved in the database.
     * @param {BarbeiroCreateManyAndReturnArgs} args - Arguments to create many Barbeiros.
     * @example
     * // Create many Barbeiros
     * const barbeiro = await prisma.barbeiro.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Barbeiros and only return the `id`
     * const barbeiroWithIdOnly = await prisma.barbeiro.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BarbeiroCreateManyAndReturnArgs>(args?: SelectSubset<T, BarbeiroCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BarbeiroPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Barbeiro.
     * @param {BarbeiroDeleteArgs} args - Arguments to delete one Barbeiro.
     * @example
     * // Delete one Barbeiro
     * const Barbeiro = await prisma.barbeiro.delete({
     *   where: {
     *     // ... filter to delete one Barbeiro
     *   }
     * })
     * 
     */
    delete<T extends BarbeiroDeleteArgs>(args: SelectSubset<T, BarbeiroDeleteArgs<ExtArgs>>): Prisma__BarbeiroClient<$Result.GetResult<Prisma.$BarbeiroPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Barbeiro.
     * @param {BarbeiroUpdateArgs} args - Arguments to update one Barbeiro.
     * @example
     * // Update one Barbeiro
     * const barbeiro = await prisma.barbeiro.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BarbeiroUpdateArgs>(args: SelectSubset<T, BarbeiroUpdateArgs<ExtArgs>>): Prisma__BarbeiroClient<$Result.GetResult<Prisma.$BarbeiroPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Barbeiros.
     * @param {BarbeiroDeleteManyArgs} args - Arguments to filter Barbeiros to delete.
     * @example
     * // Delete a few Barbeiros
     * const { count } = await prisma.barbeiro.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BarbeiroDeleteManyArgs>(args?: SelectSubset<T, BarbeiroDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Barbeiros.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BarbeiroUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Barbeiros
     * const barbeiro = await prisma.barbeiro.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BarbeiroUpdateManyArgs>(args: SelectSubset<T, BarbeiroUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Barbeiro.
     * @param {BarbeiroUpsertArgs} args - Arguments to update or create a Barbeiro.
     * @example
     * // Update or create a Barbeiro
     * const barbeiro = await prisma.barbeiro.upsert({
     *   create: {
     *     // ... data to create a Barbeiro
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Barbeiro we want to update
     *   }
     * })
     */
    upsert<T extends BarbeiroUpsertArgs>(args: SelectSubset<T, BarbeiroUpsertArgs<ExtArgs>>): Prisma__BarbeiroClient<$Result.GetResult<Prisma.$BarbeiroPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Barbeiros.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BarbeiroCountArgs} args - Arguments to filter Barbeiros to count.
     * @example
     * // Count the number of Barbeiros
     * const count = await prisma.barbeiro.count({
     *   where: {
     *     // ... the filter for the Barbeiros we want to count
     *   }
     * })
    **/
    count<T extends BarbeiroCountArgs>(
      args?: Subset<T, BarbeiroCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BarbeiroCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Barbeiro.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BarbeiroAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BarbeiroAggregateArgs>(args: Subset<T, BarbeiroAggregateArgs>): Prisma.PrismaPromise<GetBarbeiroAggregateType<T>>

    /**
     * Group by Barbeiro.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BarbeiroGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BarbeiroGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BarbeiroGroupByArgs['orderBy'] }
        : { orderBy?: BarbeiroGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BarbeiroGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBarbeiroGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Barbeiro model
   */
  readonly fields: BarbeiroFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Barbeiro.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BarbeiroClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    filial<T extends FilialDefaultArgs<ExtArgs> = {}>(args?: Subset<T, FilialDefaultArgs<ExtArgs>>): Prisma__FilialClient<$Result.GetResult<Prisma.$FilialPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    usuario<T extends UsuarioDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UsuarioDefaultArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    agendamentos<T extends Barbeiro$agendamentosArgs<ExtArgs> = {}>(args?: Subset<T, Barbeiro$agendamentosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgendamentoPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Barbeiro model
   */ 
  interface BarbeiroFieldRefs {
    readonly id: FieldRef<"Barbeiro", 'Int'>
    readonly descricao: FieldRef<"Barbeiro", 'String'>
    readonly dataAdmissao: FieldRef<"Barbeiro", 'DateTime'>
    readonly status: FieldRef<"Barbeiro", 'StatusBarbeiro'>
    readonly idFilial: FieldRef<"Barbeiro", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Barbeiro findUnique
   */
  export type BarbeiroFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Barbeiro
     */
    select?: BarbeiroSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BarbeiroInclude<ExtArgs> | null
    /**
     * Filter, which Barbeiro to fetch.
     */
    where: BarbeiroWhereUniqueInput
  }

  /**
   * Barbeiro findUniqueOrThrow
   */
  export type BarbeiroFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Barbeiro
     */
    select?: BarbeiroSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BarbeiroInclude<ExtArgs> | null
    /**
     * Filter, which Barbeiro to fetch.
     */
    where: BarbeiroWhereUniqueInput
  }

  /**
   * Barbeiro findFirst
   */
  export type BarbeiroFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Barbeiro
     */
    select?: BarbeiroSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BarbeiroInclude<ExtArgs> | null
    /**
     * Filter, which Barbeiro to fetch.
     */
    where?: BarbeiroWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Barbeiros to fetch.
     */
    orderBy?: BarbeiroOrderByWithRelationInput | BarbeiroOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Barbeiros.
     */
    cursor?: BarbeiroWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Barbeiros from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Barbeiros.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Barbeiros.
     */
    distinct?: BarbeiroScalarFieldEnum | BarbeiroScalarFieldEnum[]
  }

  /**
   * Barbeiro findFirstOrThrow
   */
  export type BarbeiroFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Barbeiro
     */
    select?: BarbeiroSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BarbeiroInclude<ExtArgs> | null
    /**
     * Filter, which Barbeiro to fetch.
     */
    where?: BarbeiroWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Barbeiros to fetch.
     */
    orderBy?: BarbeiroOrderByWithRelationInput | BarbeiroOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Barbeiros.
     */
    cursor?: BarbeiroWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Barbeiros from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Barbeiros.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Barbeiros.
     */
    distinct?: BarbeiroScalarFieldEnum | BarbeiroScalarFieldEnum[]
  }

  /**
   * Barbeiro findMany
   */
  export type BarbeiroFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Barbeiro
     */
    select?: BarbeiroSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BarbeiroInclude<ExtArgs> | null
    /**
     * Filter, which Barbeiros to fetch.
     */
    where?: BarbeiroWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Barbeiros to fetch.
     */
    orderBy?: BarbeiroOrderByWithRelationInput | BarbeiroOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Barbeiros.
     */
    cursor?: BarbeiroWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Barbeiros from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Barbeiros.
     */
    skip?: number
    distinct?: BarbeiroScalarFieldEnum | BarbeiroScalarFieldEnum[]
  }

  /**
   * Barbeiro create
   */
  export type BarbeiroCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Barbeiro
     */
    select?: BarbeiroSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BarbeiroInclude<ExtArgs> | null
    /**
     * The data needed to create a Barbeiro.
     */
    data: XOR<BarbeiroCreateInput, BarbeiroUncheckedCreateInput>
  }

  /**
   * Barbeiro createMany
   */
  export type BarbeiroCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Barbeiros.
     */
    data: BarbeiroCreateManyInput | BarbeiroCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Barbeiro createManyAndReturn
   */
  export type BarbeiroCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Barbeiro
     */
    select?: BarbeiroSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Barbeiros.
     */
    data: BarbeiroCreateManyInput | BarbeiroCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BarbeiroIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Barbeiro update
   */
  export type BarbeiroUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Barbeiro
     */
    select?: BarbeiroSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BarbeiroInclude<ExtArgs> | null
    /**
     * The data needed to update a Barbeiro.
     */
    data: XOR<BarbeiroUpdateInput, BarbeiroUncheckedUpdateInput>
    /**
     * Choose, which Barbeiro to update.
     */
    where: BarbeiroWhereUniqueInput
  }

  /**
   * Barbeiro updateMany
   */
  export type BarbeiroUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Barbeiros.
     */
    data: XOR<BarbeiroUpdateManyMutationInput, BarbeiroUncheckedUpdateManyInput>
    /**
     * Filter which Barbeiros to update
     */
    where?: BarbeiroWhereInput
  }

  /**
   * Barbeiro upsert
   */
  export type BarbeiroUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Barbeiro
     */
    select?: BarbeiroSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BarbeiroInclude<ExtArgs> | null
    /**
     * The filter to search for the Barbeiro to update in case it exists.
     */
    where: BarbeiroWhereUniqueInput
    /**
     * In case the Barbeiro found by the `where` argument doesn't exist, create a new Barbeiro with this data.
     */
    create: XOR<BarbeiroCreateInput, BarbeiroUncheckedCreateInput>
    /**
     * In case the Barbeiro was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BarbeiroUpdateInput, BarbeiroUncheckedUpdateInput>
  }

  /**
   * Barbeiro delete
   */
  export type BarbeiroDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Barbeiro
     */
    select?: BarbeiroSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BarbeiroInclude<ExtArgs> | null
    /**
     * Filter which Barbeiro to delete.
     */
    where: BarbeiroWhereUniqueInput
  }

  /**
   * Barbeiro deleteMany
   */
  export type BarbeiroDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Barbeiros to delete
     */
    where?: BarbeiroWhereInput
  }

  /**
   * Barbeiro.agendamentos
   */
  export type Barbeiro$agendamentosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Agendamento
     */
    select?: AgendamentoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgendamentoInclude<ExtArgs> | null
    where?: AgendamentoWhereInput
    orderBy?: AgendamentoOrderByWithRelationInput | AgendamentoOrderByWithRelationInput[]
    cursor?: AgendamentoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AgendamentoScalarFieldEnum | AgendamentoScalarFieldEnum[]
  }

  /**
   * Barbeiro without action
   */
  export type BarbeiroDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Barbeiro
     */
    select?: BarbeiroSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BarbeiroInclude<ExtArgs> | null
  }


  /**
   * Model Filial
   */

  export type AggregateFilial = {
    _count: FilialCountAggregateOutputType | null
    _avg: FilialAvgAggregateOutputType | null
    _sum: FilialSumAggregateOutputType | null
    _min: FilialMinAggregateOutputType | null
    _max: FilialMaxAggregateOutputType | null
  }

  export type FilialAvgAggregateOutputType = {
    id: number | null
    idEndereco: number | null
  }

  export type FilialSumAggregateOutputType = {
    id: number | null
    idEndereco: number | null
  }

  export type FilialMinAggregateOutputType = {
    id: number | null
    nome: string | null
    cnpj: string | null
    telefone: string | null
    email: string | null
    horarioAbertura: string | null
    horarioFechamento: string | null
    idEndereco: number | null
  }

  export type FilialMaxAggregateOutputType = {
    id: number | null
    nome: string | null
    cnpj: string | null
    telefone: string | null
    email: string | null
    horarioAbertura: string | null
    horarioFechamento: string | null
    idEndereco: number | null
  }

  export type FilialCountAggregateOutputType = {
    id: number
    nome: number
    cnpj: number
    telefone: number
    email: number
    horarioAbertura: number
    horarioFechamento: number
    idEndereco: number
    _all: number
  }


  export type FilialAvgAggregateInputType = {
    id?: true
    idEndereco?: true
  }

  export type FilialSumAggregateInputType = {
    id?: true
    idEndereco?: true
  }

  export type FilialMinAggregateInputType = {
    id?: true
    nome?: true
    cnpj?: true
    telefone?: true
    email?: true
    horarioAbertura?: true
    horarioFechamento?: true
    idEndereco?: true
  }

  export type FilialMaxAggregateInputType = {
    id?: true
    nome?: true
    cnpj?: true
    telefone?: true
    email?: true
    horarioAbertura?: true
    horarioFechamento?: true
    idEndereco?: true
  }

  export type FilialCountAggregateInputType = {
    id?: true
    nome?: true
    cnpj?: true
    telefone?: true
    email?: true
    horarioAbertura?: true
    horarioFechamento?: true
    idEndereco?: true
    _all?: true
  }

  export type FilialAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Filial to aggregate.
     */
    where?: FilialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Filials to fetch.
     */
    orderBy?: FilialOrderByWithRelationInput | FilialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FilialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Filials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Filials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Filials
    **/
    _count?: true | FilialCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FilialAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FilialSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FilialMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FilialMaxAggregateInputType
  }

  export type GetFilialAggregateType<T extends FilialAggregateArgs> = {
        [P in keyof T & keyof AggregateFilial]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFilial[P]>
      : GetScalarType<T[P], AggregateFilial[P]>
  }




  export type FilialGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FilialWhereInput
    orderBy?: FilialOrderByWithAggregationInput | FilialOrderByWithAggregationInput[]
    by: FilialScalarFieldEnum[] | FilialScalarFieldEnum
    having?: FilialScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FilialCountAggregateInputType | true
    _avg?: FilialAvgAggregateInputType
    _sum?: FilialSumAggregateInputType
    _min?: FilialMinAggregateInputType
    _max?: FilialMaxAggregateInputType
  }

  export type FilialGroupByOutputType = {
    id: number
    nome: string
    cnpj: string
    telefone: string | null
    email: string | null
    horarioAbertura: string | null
    horarioFechamento: string | null
    idEndereco: number
    _count: FilialCountAggregateOutputType | null
    _avg: FilialAvgAggregateOutputType | null
    _sum: FilialSumAggregateOutputType | null
    _min: FilialMinAggregateOutputType | null
    _max: FilialMaxAggregateOutputType | null
  }

  type GetFilialGroupByPayload<T extends FilialGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FilialGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FilialGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FilialGroupByOutputType[P]>
            : GetScalarType<T[P], FilialGroupByOutputType[P]>
        }
      >
    >


  export type FilialSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    cnpj?: boolean
    telefone?: boolean
    email?: boolean
    horarioAbertura?: boolean
    horarioFechamento?: boolean
    idEndereco?: boolean
    endereco?: boolean | EnderecoDefaultArgs<ExtArgs>
    barbeiros?: boolean | Filial$barbeirosArgs<ExtArgs>
    agendamentos?: boolean | Filial$agendamentosArgs<ExtArgs>
    _count?: boolean | FilialCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["filial"]>

  export type FilialSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    cnpj?: boolean
    telefone?: boolean
    email?: boolean
    horarioAbertura?: boolean
    horarioFechamento?: boolean
    idEndereco?: boolean
    endereco?: boolean | EnderecoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["filial"]>

  export type FilialSelectScalar = {
    id?: boolean
    nome?: boolean
    cnpj?: boolean
    telefone?: boolean
    email?: boolean
    horarioAbertura?: boolean
    horarioFechamento?: boolean
    idEndereco?: boolean
  }

  export type FilialInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    endereco?: boolean | EnderecoDefaultArgs<ExtArgs>
    barbeiros?: boolean | Filial$barbeirosArgs<ExtArgs>
    agendamentos?: boolean | Filial$agendamentosArgs<ExtArgs>
    _count?: boolean | FilialCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type FilialIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    endereco?: boolean | EnderecoDefaultArgs<ExtArgs>
  }

  export type $FilialPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Filial"
    objects: {
      endereco: Prisma.$EnderecoPayload<ExtArgs>
      barbeiros: Prisma.$BarbeiroPayload<ExtArgs>[]
      agendamentos: Prisma.$AgendamentoPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      nome: string
      cnpj: string
      telefone: string | null
      email: string | null
      horarioAbertura: string | null
      horarioFechamento: string | null
      idEndereco: number
    }, ExtArgs["result"]["filial"]>
    composites: {}
  }

  type FilialGetPayload<S extends boolean | null | undefined | FilialDefaultArgs> = $Result.GetResult<Prisma.$FilialPayload, S>

  type FilialCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<FilialFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: FilialCountAggregateInputType | true
    }

  export interface FilialDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Filial'], meta: { name: 'Filial' } }
    /**
     * Find zero or one Filial that matches the filter.
     * @param {FilialFindUniqueArgs} args - Arguments to find a Filial
     * @example
     * // Get one Filial
     * const filial = await prisma.filial.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FilialFindUniqueArgs>(args: SelectSubset<T, FilialFindUniqueArgs<ExtArgs>>): Prisma__FilialClient<$Result.GetResult<Prisma.$FilialPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Filial that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {FilialFindUniqueOrThrowArgs} args - Arguments to find a Filial
     * @example
     * // Get one Filial
     * const filial = await prisma.filial.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FilialFindUniqueOrThrowArgs>(args: SelectSubset<T, FilialFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FilialClient<$Result.GetResult<Prisma.$FilialPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Filial that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FilialFindFirstArgs} args - Arguments to find a Filial
     * @example
     * // Get one Filial
     * const filial = await prisma.filial.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FilialFindFirstArgs>(args?: SelectSubset<T, FilialFindFirstArgs<ExtArgs>>): Prisma__FilialClient<$Result.GetResult<Prisma.$FilialPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Filial that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FilialFindFirstOrThrowArgs} args - Arguments to find a Filial
     * @example
     * // Get one Filial
     * const filial = await prisma.filial.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FilialFindFirstOrThrowArgs>(args?: SelectSubset<T, FilialFindFirstOrThrowArgs<ExtArgs>>): Prisma__FilialClient<$Result.GetResult<Prisma.$FilialPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Filials that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FilialFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Filials
     * const filials = await prisma.filial.findMany()
     * 
     * // Get first 10 Filials
     * const filials = await prisma.filial.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const filialWithIdOnly = await prisma.filial.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FilialFindManyArgs>(args?: SelectSubset<T, FilialFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FilialPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Filial.
     * @param {FilialCreateArgs} args - Arguments to create a Filial.
     * @example
     * // Create one Filial
     * const Filial = await prisma.filial.create({
     *   data: {
     *     // ... data to create a Filial
     *   }
     * })
     * 
     */
    create<T extends FilialCreateArgs>(args: SelectSubset<T, FilialCreateArgs<ExtArgs>>): Prisma__FilialClient<$Result.GetResult<Prisma.$FilialPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Filials.
     * @param {FilialCreateManyArgs} args - Arguments to create many Filials.
     * @example
     * // Create many Filials
     * const filial = await prisma.filial.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FilialCreateManyArgs>(args?: SelectSubset<T, FilialCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Filials and returns the data saved in the database.
     * @param {FilialCreateManyAndReturnArgs} args - Arguments to create many Filials.
     * @example
     * // Create many Filials
     * const filial = await prisma.filial.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Filials and only return the `id`
     * const filialWithIdOnly = await prisma.filial.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FilialCreateManyAndReturnArgs>(args?: SelectSubset<T, FilialCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FilialPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Filial.
     * @param {FilialDeleteArgs} args - Arguments to delete one Filial.
     * @example
     * // Delete one Filial
     * const Filial = await prisma.filial.delete({
     *   where: {
     *     // ... filter to delete one Filial
     *   }
     * })
     * 
     */
    delete<T extends FilialDeleteArgs>(args: SelectSubset<T, FilialDeleteArgs<ExtArgs>>): Prisma__FilialClient<$Result.GetResult<Prisma.$FilialPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Filial.
     * @param {FilialUpdateArgs} args - Arguments to update one Filial.
     * @example
     * // Update one Filial
     * const filial = await prisma.filial.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FilialUpdateArgs>(args: SelectSubset<T, FilialUpdateArgs<ExtArgs>>): Prisma__FilialClient<$Result.GetResult<Prisma.$FilialPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Filials.
     * @param {FilialDeleteManyArgs} args - Arguments to filter Filials to delete.
     * @example
     * // Delete a few Filials
     * const { count } = await prisma.filial.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FilialDeleteManyArgs>(args?: SelectSubset<T, FilialDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Filials.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FilialUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Filials
     * const filial = await prisma.filial.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FilialUpdateManyArgs>(args: SelectSubset<T, FilialUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Filial.
     * @param {FilialUpsertArgs} args - Arguments to update or create a Filial.
     * @example
     * // Update or create a Filial
     * const filial = await prisma.filial.upsert({
     *   create: {
     *     // ... data to create a Filial
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Filial we want to update
     *   }
     * })
     */
    upsert<T extends FilialUpsertArgs>(args: SelectSubset<T, FilialUpsertArgs<ExtArgs>>): Prisma__FilialClient<$Result.GetResult<Prisma.$FilialPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Filials.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FilialCountArgs} args - Arguments to filter Filials to count.
     * @example
     * // Count the number of Filials
     * const count = await prisma.filial.count({
     *   where: {
     *     // ... the filter for the Filials we want to count
     *   }
     * })
    **/
    count<T extends FilialCountArgs>(
      args?: Subset<T, FilialCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FilialCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Filial.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FilialAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FilialAggregateArgs>(args: Subset<T, FilialAggregateArgs>): Prisma.PrismaPromise<GetFilialAggregateType<T>>

    /**
     * Group by Filial.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FilialGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FilialGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FilialGroupByArgs['orderBy'] }
        : { orderBy?: FilialGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FilialGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFilialGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Filial model
   */
  readonly fields: FilialFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Filial.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FilialClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    endereco<T extends EnderecoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EnderecoDefaultArgs<ExtArgs>>): Prisma__EnderecoClient<$Result.GetResult<Prisma.$EnderecoPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    barbeiros<T extends Filial$barbeirosArgs<ExtArgs> = {}>(args?: Subset<T, Filial$barbeirosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BarbeiroPayload<ExtArgs>, T, "findMany"> | Null>
    agendamentos<T extends Filial$agendamentosArgs<ExtArgs> = {}>(args?: Subset<T, Filial$agendamentosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgendamentoPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Filial model
   */ 
  interface FilialFieldRefs {
    readonly id: FieldRef<"Filial", 'Int'>
    readonly nome: FieldRef<"Filial", 'String'>
    readonly cnpj: FieldRef<"Filial", 'String'>
    readonly telefone: FieldRef<"Filial", 'String'>
    readonly email: FieldRef<"Filial", 'String'>
    readonly horarioAbertura: FieldRef<"Filial", 'String'>
    readonly horarioFechamento: FieldRef<"Filial", 'String'>
    readonly idEndereco: FieldRef<"Filial", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Filial findUnique
   */
  export type FilialFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Filial
     */
    select?: FilialSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FilialInclude<ExtArgs> | null
    /**
     * Filter, which Filial to fetch.
     */
    where: FilialWhereUniqueInput
  }

  /**
   * Filial findUniqueOrThrow
   */
  export type FilialFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Filial
     */
    select?: FilialSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FilialInclude<ExtArgs> | null
    /**
     * Filter, which Filial to fetch.
     */
    where: FilialWhereUniqueInput
  }

  /**
   * Filial findFirst
   */
  export type FilialFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Filial
     */
    select?: FilialSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FilialInclude<ExtArgs> | null
    /**
     * Filter, which Filial to fetch.
     */
    where?: FilialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Filials to fetch.
     */
    orderBy?: FilialOrderByWithRelationInput | FilialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Filials.
     */
    cursor?: FilialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Filials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Filials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Filials.
     */
    distinct?: FilialScalarFieldEnum | FilialScalarFieldEnum[]
  }

  /**
   * Filial findFirstOrThrow
   */
  export type FilialFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Filial
     */
    select?: FilialSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FilialInclude<ExtArgs> | null
    /**
     * Filter, which Filial to fetch.
     */
    where?: FilialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Filials to fetch.
     */
    orderBy?: FilialOrderByWithRelationInput | FilialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Filials.
     */
    cursor?: FilialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Filials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Filials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Filials.
     */
    distinct?: FilialScalarFieldEnum | FilialScalarFieldEnum[]
  }

  /**
   * Filial findMany
   */
  export type FilialFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Filial
     */
    select?: FilialSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FilialInclude<ExtArgs> | null
    /**
     * Filter, which Filials to fetch.
     */
    where?: FilialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Filials to fetch.
     */
    orderBy?: FilialOrderByWithRelationInput | FilialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Filials.
     */
    cursor?: FilialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Filials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Filials.
     */
    skip?: number
    distinct?: FilialScalarFieldEnum | FilialScalarFieldEnum[]
  }

  /**
   * Filial create
   */
  export type FilialCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Filial
     */
    select?: FilialSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FilialInclude<ExtArgs> | null
    /**
     * The data needed to create a Filial.
     */
    data: XOR<FilialCreateInput, FilialUncheckedCreateInput>
  }

  /**
   * Filial createMany
   */
  export type FilialCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Filials.
     */
    data: FilialCreateManyInput | FilialCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Filial createManyAndReturn
   */
  export type FilialCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Filial
     */
    select?: FilialSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Filials.
     */
    data: FilialCreateManyInput | FilialCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FilialIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Filial update
   */
  export type FilialUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Filial
     */
    select?: FilialSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FilialInclude<ExtArgs> | null
    /**
     * The data needed to update a Filial.
     */
    data: XOR<FilialUpdateInput, FilialUncheckedUpdateInput>
    /**
     * Choose, which Filial to update.
     */
    where: FilialWhereUniqueInput
  }

  /**
   * Filial updateMany
   */
  export type FilialUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Filials.
     */
    data: XOR<FilialUpdateManyMutationInput, FilialUncheckedUpdateManyInput>
    /**
     * Filter which Filials to update
     */
    where?: FilialWhereInput
  }

  /**
   * Filial upsert
   */
  export type FilialUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Filial
     */
    select?: FilialSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FilialInclude<ExtArgs> | null
    /**
     * The filter to search for the Filial to update in case it exists.
     */
    where: FilialWhereUniqueInput
    /**
     * In case the Filial found by the `where` argument doesn't exist, create a new Filial with this data.
     */
    create: XOR<FilialCreateInput, FilialUncheckedCreateInput>
    /**
     * In case the Filial was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FilialUpdateInput, FilialUncheckedUpdateInput>
  }

  /**
   * Filial delete
   */
  export type FilialDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Filial
     */
    select?: FilialSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FilialInclude<ExtArgs> | null
    /**
     * Filter which Filial to delete.
     */
    where: FilialWhereUniqueInput
  }

  /**
   * Filial deleteMany
   */
  export type FilialDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Filials to delete
     */
    where?: FilialWhereInput
  }

  /**
   * Filial.barbeiros
   */
  export type Filial$barbeirosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Barbeiro
     */
    select?: BarbeiroSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BarbeiroInclude<ExtArgs> | null
    where?: BarbeiroWhereInput
    orderBy?: BarbeiroOrderByWithRelationInput | BarbeiroOrderByWithRelationInput[]
    cursor?: BarbeiroWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BarbeiroScalarFieldEnum | BarbeiroScalarFieldEnum[]
  }

  /**
   * Filial.agendamentos
   */
  export type Filial$agendamentosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Agendamento
     */
    select?: AgendamentoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgendamentoInclude<ExtArgs> | null
    where?: AgendamentoWhereInput
    orderBy?: AgendamentoOrderByWithRelationInput | AgendamentoOrderByWithRelationInput[]
    cursor?: AgendamentoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AgendamentoScalarFieldEnum | AgendamentoScalarFieldEnum[]
  }

  /**
   * Filial without action
   */
  export type FilialDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Filial
     */
    select?: FilialSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FilialInclude<ExtArgs> | null
  }


  /**
   * Model Endereco
   */

  export type AggregateEndereco = {
    _count: EnderecoCountAggregateOutputType | null
    _avg: EnderecoAvgAggregateOutputType | null
    _sum: EnderecoSumAggregateOutputType | null
    _min: EnderecoMinAggregateOutputType | null
    _max: EnderecoMaxAggregateOutputType | null
  }

  export type EnderecoAvgAggregateOutputType = {
    id: number | null
  }

  export type EnderecoSumAggregateOutputType = {
    id: number | null
  }

  export type EnderecoMinAggregateOutputType = {
    id: number | null
    cep: string | null
    logradouro: string | null
    numero: string | null
    bairro: string | null
    cidade: string | null
    estado: string | null
  }

  export type EnderecoMaxAggregateOutputType = {
    id: number | null
    cep: string | null
    logradouro: string | null
    numero: string | null
    bairro: string | null
    cidade: string | null
    estado: string | null
  }

  export type EnderecoCountAggregateOutputType = {
    id: number
    cep: number
    logradouro: number
    numero: number
    bairro: number
    cidade: number
    estado: number
    _all: number
  }


  export type EnderecoAvgAggregateInputType = {
    id?: true
  }

  export type EnderecoSumAggregateInputType = {
    id?: true
  }

  export type EnderecoMinAggregateInputType = {
    id?: true
    cep?: true
    logradouro?: true
    numero?: true
    bairro?: true
    cidade?: true
    estado?: true
  }

  export type EnderecoMaxAggregateInputType = {
    id?: true
    cep?: true
    logradouro?: true
    numero?: true
    bairro?: true
    cidade?: true
    estado?: true
  }

  export type EnderecoCountAggregateInputType = {
    id?: true
    cep?: true
    logradouro?: true
    numero?: true
    bairro?: true
    cidade?: true
    estado?: true
    _all?: true
  }

  export type EnderecoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Endereco to aggregate.
     */
    where?: EnderecoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Enderecos to fetch.
     */
    orderBy?: EnderecoOrderByWithRelationInput | EnderecoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EnderecoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Enderecos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Enderecos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Enderecos
    **/
    _count?: true | EnderecoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EnderecoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EnderecoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EnderecoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EnderecoMaxAggregateInputType
  }

  export type GetEnderecoAggregateType<T extends EnderecoAggregateArgs> = {
        [P in keyof T & keyof AggregateEndereco]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEndereco[P]>
      : GetScalarType<T[P], AggregateEndereco[P]>
  }




  export type EnderecoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EnderecoWhereInput
    orderBy?: EnderecoOrderByWithAggregationInput | EnderecoOrderByWithAggregationInput[]
    by: EnderecoScalarFieldEnum[] | EnderecoScalarFieldEnum
    having?: EnderecoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EnderecoCountAggregateInputType | true
    _avg?: EnderecoAvgAggregateInputType
    _sum?: EnderecoSumAggregateInputType
    _min?: EnderecoMinAggregateInputType
    _max?: EnderecoMaxAggregateInputType
  }

  export type EnderecoGroupByOutputType = {
    id: number
    cep: string
    logradouro: string
    numero: string
    bairro: string
    cidade: string
    estado: string
    _count: EnderecoCountAggregateOutputType | null
    _avg: EnderecoAvgAggregateOutputType | null
    _sum: EnderecoSumAggregateOutputType | null
    _min: EnderecoMinAggregateOutputType | null
    _max: EnderecoMaxAggregateOutputType | null
  }

  type GetEnderecoGroupByPayload<T extends EnderecoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EnderecoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EnderecoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EnderecoGroupByOutputType[P]>
            : GetScalarType<T[P], EnderecoGroupByOutputType[P]>
        }
      >
    >


  export type EnderecoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cep?: boolean
    logradouro?: boolean
    numero?: boolean
    bairro?: boolean
    cidade?: boolean
    estado?: boolean
    filial?: boolean | Endereco$filialArgs<ExtArgs>
  }, ExtArgs["result"]["endereco"]>

  export type EnderecoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cep?: boolean
    logradouro?: boolean
    numero?: boolean
    bairro?: boolean
    cidade?: boolean
    estado?: boolean
  }, ExtArgs["result"]["endereco"]>

  export type EnderecoSelectScalar = {
    id?: boolean
    cep?: boolean
    logradouro?: boolean
    numero?: boolean
    bairro?: boolean
    cidade?: boolean
    estado?: boolean
  }

  export type EnderecoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    filial?: boolean | Endereco$filialArgs<ExtArgs>
  }
  export type EnderecoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $EnderecoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Endereco"
    objects: {
      filial: Prisma.$FilialPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      cep: string
      logradouro: string
      numero: string
      bairro: string
      cidade: string
      estado: string
    }, ExtArgs["result"]["endereco"]>
    composites: {}
  }

  type EnderecoGetPayload<S extends boolean | null | undefined | EnderecoDefaultArgs> = $Result.GetResult<Prisma.$EnderecoPayload, S>

  type EnderecoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<EnderecoFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: EnderecoCountAggregateInputType | true
    }

  export interface EnderecoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Endereco'], meta: { name: 'Endereco' } }
    /**
     * Find zero or one Endereco that matches the filter.
     * @param {EnderecoFindUniqueArgs} args - Arguments to find a Endereco
     * @example
     * // Get one Endereco
     * const endereco = await prisma.endereco.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EnderecoFindUniqueArgs>(args: SelectSubset<T, EnderecoFindUniqueArgs<ExtArgs>>): Prisma__EnderecoClient<$Result.GetResult<Prisma.$EnderecoPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Endereco that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {EnderecoFindUniqueOrThrowArgs} args - Arguments to find a Endereco
     * @example
     * // Get one Endereco
     * const endereco = await prisma.endereco.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EnderecoFindUniqueOrThrowArgs>(args: SelectSubset<T, EnderecoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EnderecoClient<$Result.GetResult<Prisma.$EnderecoPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Endereco that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnderecoFindFirstArgs} args - Arguments to find a Endereco
     * @example
     * // Get one Endereco
     * const endereco = await prisma.endereco.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EnderecoFindFirstArgs>(args?: SelectSubset<T, EnderecoFindFirstArgs<ExtArgs>>): Prisma__EnderecoClient<$Result.GetResult<Prisma.$EnderecoPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Endereco that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnderecoFindFirstOrThrowArgs} args - Arguments to find a Endereco
     * @example
     * // Get one Endereco
     * const endereco = await prisma.endereco.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EnderecoFindFirstOrThrowArgs>(args?: SelectSubset<T, EnderecoFindFirstOrThrowArgs<ExtArgs>>): Prisma__EnderecoClient<$Result.GetResult<Prisma.$EnderecoPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Enderecos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnderecoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Enderecos
     * const enderecos = await prisma.endereco.findMany()
     * 
     * // Get first 10 Enderecos
     * const enderecos = await prisma.endereco.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const enderecoWithIdOnly = await prisma.endereco.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EnderecoFindManyArgs>(args?: SelectSubset<T, EnderecoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EnderecoPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Endereco.
     * @param {EnderecoCreateArgs} args - Arguments to create a Endereco.
     * @example
     * // Create one Endereco
     * const Endereco = await prisma.endereco.create({
     *   data: {
     *     // ... data to create a Endereco
     *   }
     * })
     * 
     */
    create<T extends EnderecoCreateArgs>(args: SelectSubset<T, EnderecoCreateArgs<ExtArgs>>): Prisma__EnderecoClient<$Result.GetResult<Prisma.$EnderecoPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Enderecos.
     * @param {EnderecoCreateManyArgs} args - Arguments to create many Enderecos.
     * @example
     * // Create many Enderecos
     * const endereco = await prisma.endereco.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EnderecoCreateManyArgs>(args?: SelectSubset<T, EnderecoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Enderecos and returns the data saved in the database.
     * @param {EnderecoCreateManyAndReturnArgs} args - Arguments to create many Enderecos.
     * @example
     * // Create many Enderecos
     * const endereco = await prisma.endereco.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Enderecos and only return the `id`
     * const enderecoWithIdOnly = await prisma.endereco.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EnderecoCreateManyAndReturnArgs>(args?: SelectSubset<T, EnderecoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EnderecoPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Endereco.
     * @param {EnderecoDeleteArgs} args - Arguments to delete one Endereco.
     * @example
     * // Delete one Endereco
     * const Endereco = await prisma.endereco.delete({
     *   where: {
     *     // ... filter to delete one Endereco
     *   }
     * })
     * 
     */
    delete<T extends EnderecoDeleteArgs>(args: SelectSubset<T, EnderecoDeleteArgs<ExtArgs>>): Prisma__EnderecoClient<$Result.GetResult<Prisma.$EnderecoPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Endereco.
     * @param {EnderecoUpdateArgs} args - Arguments to update one Endereco.
     * @example
     * // Update one Endereco
     * const endereco = await prisma.endereco.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EnderecoUpdateArgs>(args: SelectSubset<T, EnderecoUpdateArgs<ExtArgs>>): Prisma__EnderecoClient<$Result.GetResult<Prisma.$EnderecoPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Enderecos.
     * @param {EnderecoDeleteManyArgs} args - Arguments to filter Enderecos to delete.
     * @example
     * // Delete a few Enderecos
     * const { count } = await prisma.endereco.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EnderecoDeleteManyArgs>(args?: SelectSubset<T, EnderecoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Enderecos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnderecoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Enderecos
     * const endereco = await prisma.endereco.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EnderecoUpdateManyArgs>(args: SelectSubset<T, EnderecoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Endereco.
     * @param {EnderecoUpsertArgs} args - Arguments to update or create a Endereco.
     * @example
     * // Update or create a Endereco
     * const endereco = await prisma.endereco.upsert({
     *   create: {
     *     // ... data to create a Endereco
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Endereco we want to update
     *   }
     * })
     */
    upsert<T extends EnderecoUpsertArgs>(args: SelectSubset<T, EnderecoUpsertArgs<ExtArgs>>): Prisma__EnderecoClient<$Result.GetResult<Prisma.$EnderecoPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Enderecos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnderecoCountArgs} args - Arguments to filter Enderecos to count.
     * @example
     * // Count the number of Enderecos
     * const count = await prisma.endereco.count({
     *   where: {
     *     // ... the filter for the Enderecos we want to count
     *   }
     * })
    **/
    count<T extends EnderecoCountArgs>(
      args?: Subset<T, EnderecoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EnderecoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Endereco.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnderecoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EnderecoAggregateArgs>(args: Subset<T, EnderecoAggregateArgs>): Prisma.PrismaPromise<GetEnderecoAggregateType<T>>

    /**
     * Group by Endereco.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnderecoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EnderecoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EnderecoGroupByArgs['orderBy'] }
        : { orderBy?: EnderecoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EnderecoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEnderecoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Endereco model
   */
  readonly fields: EnderecoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Endereco.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EnderecoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    filial<T extends Endereco$filialArgs<ExtArgs> = {}>(args?: Subset<T, Endereco$filialArgs<ExtArgs>>): Prisma__FilialClient<$Result.GetResult<Prisma.$FilialPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Endereco model
   */ 
  interface EnderecoFieldRefs {
    readonly id: FieldRef<"Endereco", 'Int'>
    readonly cep: FieldRef<"Endereco", 'String'>
    readonly logradouro: FieldRef<"Endereco", 'String'>
    readonly numero: FieldRef<"Endereco", 'String'>
    readonly bairro: FieldRef<"Endereco", 'String'>
    readonly cidade: FieldRef<"Endereco", 'String'>
    readonly estado: FieldRef<"Endereco", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Endereco findUnique
   */
  export type EnderecoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Endereco
     */
    select?: EnderecoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnderecoInclude<ExtArgs> | null
    /**
     * Filter, which Endereco to fetch.
     */
    where: EnderecoWhereUniqueInput
  }

  /**
   * Endereco findUniqueOrThrow
   */
  export type EnderecoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Endereco
     */
    select?: EnderecoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnderecoInclude<ExtArgs> | null
    /**
     * Filter, which Endereco to fetch.
     */
    where: EnderecoWhereUniqueInput
  }

  /**
   * Endereco findFirst
   */
  export type EnderecoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Endereco
     */
    select?: EnderecoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnderecoInclude<ExtArgs> | null
    /**
     * Filter, which Endereco to fetch.
     */
    where?: EnderecoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Enderecos to fetch.
     */
    orderBy?: EnderecoOrderByWithRelationInput | EnderecoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Enderecos.
     */
    cursor?: EnderecoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Enderecos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Enderecos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Enderecos.
     */
    distinct?: EnderecoScalarFieldEnum | EnderecoScalarFieldEnum[]
  }

  /**
   * Endereco findFirstOrThrow
   */
  export type EnderecoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Endereco
     */
    select?: EnderecoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnderecoInclude<ExtArgs> | null
    /**
     * Filter, which Endereco to fetch.
     */
    where?: EnderecoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Enderecos to fetch.
     */
    orderBy?: EnderecoOrderByWithRelationInput | EnderecoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Enderecos.
     */
    cursor?: EnderecoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Enderecos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Enderecos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Enderecos.
     */
    distinct?: EnderecoScalarFieldEnum | EnderecoScalarFieldEnum[]
  }

  /**
   * Endereco findMany
   */
  export type EnderecoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Endereco
     */
    select?: EnderecoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnderecoInclude<ExtArgs> | null
    /**
     * Filter, which Enderecos to fetch.
     */
    where?: EnderecoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Enderecos to fetch.
     */
    orderBy?: EnderecoOrderByWithRelationInput | EnderecoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Enderecos.
     */
    cursor?: EnderecoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Enderecos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Enderecos.
     */
    skip?: number
    distinct?: EnderecoScalarFieldEnum | EnderecoScalarFieldEnum[]
  }

  /**
   * Endereco create
   */
  export type EnderecoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Endereco
     */
    select?: EnderecoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnderecoInclude<ExtArgs> | null
    /**
     * The data needed to create a Endereco.
     */
    data: XOR<EnderecoCreateInput, EnderecoUncheckedCreateInput>
  }

  /**
   * Endereco createMany
   */
  export type EnderecoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Enderecos.
     */
    data: EnderecoCreateManyInput | EnderecoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Endereco createManyAndReturn
   */
  export type EnderecoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Endereco
     */
    select?: EnderecoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Enderecos.
     */
    data: EnderecoCreateManyInput | EnderecoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Endereco update
   */
  export type EnderecoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Endereco
     */
    select?: EnderecoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnderecoInclude<ExtArgs> | null
    /**
     * The data needed to update a Endereco.
     */
    data: XOR<EnderecoUpdateInput, EnderecoUncheckedUpdateInput>
    /**
     * Choose, which Endereco to update.
     */
    where: EnderecoWhereUniqueInput
  }

  /**
   * Endereco updateMany
   */
  export type EnderecoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Enderecos.
     */
    data: XOR<EnderecoUpdateManyMutationInput, EnderecoUncheckedUpdateManyInput>
    /**
     * Filter which Enderecos to update
     */
    where?: EnderecoWhereInput
  }

  /**
   * Endereco upsert
   */
  export type EnderecoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Endereco
     */
    select?: EnderecoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnderecoInclude<ExtArgs> | null
    /**
     * The filter to search for the Endereco to update in case it exists.
     */
    where: EnderecoWhereUniqueInput
    /**
     * In case the Endereco found by the `where` argument doesn't exist, create a new Endereco with this data.
     */
    create: XOR<EnderecoCreateInput, EnderecoUncheckedCreateInput>
    /**
     * In case the Endereco was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EnderecoUpdateInput, EnderecoUncheckedUpdateInput>
  }

  /**
   * Endereco delete
   */
  export type EnderecoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Endereco
     */
    select?: EnderecoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnderecoInclude<ExtArgs> | null
    /**
     * Filter which Endereco to delete.
     */
    where: EnderecoWhereUniqueInput
  }

  /**
   * Endereco deleteMany
   */
  export type EnderecoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Enderecos to delete
     */
    where?: EnderecoWhereInput
  }

  /**
   * Endereco.filial
   */
  export type Endereco$filialArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Filial
     */
    select?: FilialSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FilialInclude<ExtArgs> | null
    where?: FilialWhereInput
  }

  /**
   * Endereco without action
   */
  export type EnderecoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Endereco
     */
    select?: EnderecoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnderecoInclude<ExtArgs> | null
  }


  /**
   * Model Servico
   */

  export type AggregateServico = {
    _count: ServicoCountAggregateOutputType | null
    _avg: ServicoAvgAggregateOutputType | null
    _sum: ServicoSumAggregateOutputType | null
    _min: ServicoMinAggregateOutputType | null
    _max: ServicoMaxAggregateOutputType | null
  }

  export type ServicoAvgAggregateOutputType = {
    id: number | null
    preco: Decimal | null
    duracaoMinutos: number | null
  }

  export type ServicoSumAggregateOutputType = {
    id: number | null
    preco: Decimal | null
    duracaoMinutos: number | null
  }

  export type ServicoMinAggregateOutputType = {
    id: number | null
    nome: string | null
    descricao: string | null
    preco: Decimal | null
    duracaoMinutos: number | null
  }

  export type ServicoMaxAggregateOutputType = {
    id: number | null
    nome: string | null
    descricao: string | null
    preco: Decimal | null
    duracaoMinutos: number | null
  }

  export type ServicoCountAggregateOutputType = {
    id: number
    nome: number
    descricao: number
    preco: number
    duracaoMinutos: number
    _all: number
  }


  export type ServicoAvgAggregateInputType = {
    id?: true
    preco?: true
    duracaoMinutos?: true
  }

  export type ServicoSumAggregateInputType = {
    id?: true
    preco?: true
    duracaoMinutos?: true
  }

  export type ServicoMinAggregateInputType = {
    id?: true
    nome?: true
    descricao?: true
    preco?: true
    duracaoMinutos?: true
  }

  export type ServicoMaxAggregateInputType = {
    id?: true
    nome?: true
    descricao?: true
    preco?: true
    duracaoMinutos?: true
  }

  export type ServicoCountAggregateInputType = {
    id?: true
    nome?: true
    descricao?: true
    preco?: true
    duracaoMinutos?: true
    _all?: true
  }

  export type ServicoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Servico to aggregate.
     */
    where?: ServicoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Servicos to fetch.
     */
    orderBy?: ServicoOrderByWithRelationInput | ServicoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ServicoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Servicos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Servicos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Servicos
    **/
    _count?: true | ServicoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ServicoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ServicoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ServicoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ServicoMaxAggregateInputType
  }

  export type GetServicoAggregateType<T extends ServicoAggregateArgs> = {
        [P in keyof T & keyof AggregateServico]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateServico[P]>
      : GetScalarType<T[P], AggregateServico[P]>
  }




  export type ServicoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ServicoWhereInput
    orderBy?: ServicoOrderByWithAggregationInput | ServicoOrderByWithAggregationInput[]
    by: ServicoScalarFieldEnum[] | ServicoScalarFieldEnum
    having?: ServicoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ServicoCountAggregateInputType | true
    _avg?: ServicoAvgAggregateInputType
    _sum?: ServicoSumAggregateInputType
    _min?: ServicoMinAggregateInputType
    _max?: ServicoMaxAggregateInputType
  }

  export type ServicoGroupByOutputType = {
    id: number
    nome: string
    descricao: string | null
    preco: Decimal
    duracaoMinutos: number
    _count: ServicoCountAggregateOutputType | null
    _avg: ServicoAvgAggregateOutputType | null
    _sum: ServicoSumAggregateOutputType | null
    _min: ServicoMinAggregateOutputType | null
    _max: ServicoMaxAggregateOutputType | null
  }

  type GetServicoGroupByPayload<T extends ServicoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ServicoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ServicoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ServicoGroupByOutputType[P]>
            : GetScalarType<T[P], ServicoGroupByOutputType[P]>
        }
      >
    >


  export type ServicoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    descricao?: boolean
    preco?: boolean
    duracaoMinutos?: boolean
    agendamentos?: boolean | Servico$agendamentosArgs<ExtArgs>
    _count?: boolean | ServicoCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["servico"]>

  export type ServicoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    descricao?: boolean
    preco?: boolean
    duracaoMinutos?: boolean
  }, ExtArgs["result"]["servico"]>

  export type ServicoSelectScalar = {
    id?: boolean
    nome?: boolean
    descricao?: boolean
    preco?: boolean
    duracaoMinutos?: boolean
  }

  export type ServicoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    agendamentos?: boolean | Servico$agendamentosArgs<ExtArgs>
    _count?: boolean | ServicoCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ServicoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ServicoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Servico"
    objects: {
      agendamentos: Prisma.$AgendamentoServicoPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      nome: string
      descricao: string | null
      preco: Prisma.Decimal
      duracaoMinutos: number
    }, ExtArgs["result"]["servico"]>
    composites: {}
  }

  type ServicoGetPayload<S extends boolean | null | undefined | ServicoDefaultArgs> = $Result.GetResult<Prisma.$ServicoPayload, S>

  type ServicoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ServicoFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ServicoCountAggregateInputType | true
    }

  export interface ServicoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Servico'], meta: { name: 'Servico' } }
    /**
     * Find zero or one Servico that matches the filter.
     * @param {ServicoFindUniqueArgs} args - Arguments to find a Servico
     * @example
     * // Get one Servico
     * const servico = await prisma.servico.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ServicoFindUniqueArgs>(args: SelectSubset<T, ServicoFindUniqueArgs<ExtArgs>>): Prisma__ServicoClient<$Result.GetResult<Prisma.$ServicoPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Servico that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ServicoFindUniqueOrThrowArgs} args - Arguments to find a Servico
     * @example
     * // Get one Servico
     * const servico = await prisma.servico.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ServicoFindUniqueOrThrowArgs>(args: SelectSubset<T, ServicoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ServicoClient<$Result.GetResult<Prisma.$ServicoPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Servico that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServicoFindFirstArgs} args - Arguments to find a Servico
     * @example
     * // Get one Servico
     * const servico = await prisma.servico.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ServicoFindFirstArgs>(args?: SelectSubset<T, ServicoFindFirstArgs<ExtArgs>>): Prisma__ServicoClient<$Result.GetResult<Prisma.$ServicoPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Servico that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServicoFindFirstOrThrowArgs} args - Arguments to find a Servico
     * @example
     * // Get one Servico
     * const servico = await prisma.servico.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ServicoFindFirstOrThrowArgs>(args?: SelectSubset<T, ServicoFindFirstOrThrowArgs<ExtArgs>>): Prisma__ServicoClient<$Result.GetResult<Prisma.$ServicoPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Servicos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServicoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Servicos
     * const servicos = await prisma.servico.findMany()
     * 
     * // Get first 10 Servicos
     * const servicos = await prisma.servico.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const servicoWithIdOnly = await prisma.servico.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ServicoFindManyArgs>(args?: SelectSubset<T, ServicoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ServicoPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Servico.
     * @param {ServicoCreateArgs} args - Arguments to create a Servico.
     * @example
     * // Create one Servico
     * const Servico = await prisma.servico.create({
     *   data: {
     *     // ... data to create a Servico
     *   }
     * })
     * 
     */
    create<T extends ServicoCreateArgs>(args: SelectSubset<T, ServicoCreateArgs<ExtArgs>>): Prisma__ServicoClient<$Result.GetResult<Prisma.$ServicoPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Servicos.
     * @param {ServicoCreateManyArgs} args - Arguments to create many Servicos.
     * @example
     * // Create many Servicos
     * const servico = await prisma.servico.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ServicoCreateManyArgs>(args?: SelectSubset<T, ServicoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Servicos and returns the data saved in the database.
     * @param {ServicoCreateManyAndReturnArgs} args - Arguments to create many Servicos.
     * @example
     * // Create many Servicos
     * const servico = await prisma.servico.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Servicos and only return the `id`
     * const servicoWithIdOnly = await prisma.servico.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ServicoCreateManyAndReturnArgs>(args?: SelectSubset<T, ServicoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ServicoPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Servico.
     * @param {ServicoDeleteArgs} args - Arguments to delete one Servico.
     * @example
     * // Delete one Servico
     * const Servico = await prisma.servico.delete({
     *   where: {
     *     // ... filter to delete one Servico
     *   }
     * })
     * 
     */
    delete<T extends ServicoDeleteArgs>(args: SelectSubset<T, ServicoDeleteArgs<ExtArgs>>): Prisma__ServicoClient<$Result.GetResult<Prisma.$ServicoPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Servico.
     * @param {ServicoUpdateArgs} args - Arguments to update one Servico.
     * @example
     * // Update one Servico
     * const servico = await prisma.servico.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ServicoUpdateArgs>(args: SelectSubset<T, ServicoUpdateArgs<ExtArgs>>): Prisma__ServicoClient<$Result.GetResult<Prisma.$ServicoPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Servicos.
     * @param {ServicoDeleteManyArgs} args - Arguments to filter Servicos to delete.
     * @example
     * // Delete a few Servicos
     * const { count } = await prisma.servico.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ServicoDeleteManyArgs>(args?: SelectSubset<T, ServicoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Servicos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServicoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Servicos
     * const servico = await prisma.servico.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ServicoUpdateManyArgs>(args: SelectSubset<T, ServicoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Servico.
     * @param {ServicoUpsertArgs} args - Arguments to update or create a Servico.
     * @example
     * // Update or create a Servico
     * const servico = await prisma.servico.upsert({
     *   create: {
     *     // ... data to create a Servico
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Servico we want to update
     *   }
     * })
     */
    upsert<T extends ServicoUpsertArgs>(args: SelectSubset<T, ServicoUpsertArgs<ExtArgs>>): Prisma__ServicoClient<$Result.GetResult<Prisma.$ServicoPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Servicos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServicoCountArgs} args - Arguments to filter Servicos to count.
     * @example
     * // Count the number of Servicos
     * const count = await prisma.servico.count({
     *   where: {
     *     // ... the filter for the Servicos we want to count
     *   }
     * })
    **/
    count<T extends ServicoCountArgs>(
      args?: Subset<T, ServicoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ServicoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Servico.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServicoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ServicoAggregateArgs>(args: Subset<T, ServicoAggregateArgs>): Prisma.PrismaPromise<GetServicoAggregateType<T>>

    /**
     * Group by Servico.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServicoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ServicoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ServicoGroupByArgs['orderBy'] }
        : { orderBy?: ServicoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ServicoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetServicoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Servico model
   */
  readonly fields: ServicoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Servico.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ServicoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    agendamentos<T extends Servico$agendamentosArgs<ExtArgs> = {}>(args?: Subset<T, Servico$agendamentosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgendamentoServicoPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Servico model
   */ 
  interface ServicoFieldRefs {
    readonly id: FieldRef<"Servico", 'Int'>
    readonly nome: FieldRef<"Servico", 'String'>
    readonly descricao: FieldRef<"Servico", 'String'>
    readonly preco: FieldRef<"Servico", 'Decimal'>
    readonly duracaoMinutos: FieldRef<"Servico", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Servico findUnique
   */
  export type ServicoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Servico
     */
    select?: ServicoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServicoInclude<ExtArgs> | null
    /**
     * Filter, which Servico to fetch.
     */
    where: ServicoWhereUniqueInput
  }

  /**
   * Servico findUniqueOrThrow
   */
  export type ServicoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Servico
     */
    select?: ServicoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServicoInclude<ExtArgs> | null
    /**
     * Filter, which Servico to fetch.
     */
    where: ServicoWhereUniqueInput
  }

  /**
   * Servico findFirst
   */
  export type ServicoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Servico
     */
    select?: ServicoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServicoInclude<ExtArgs> | null
    /**
     * Filter, which Servico to fetch.
     */
    where?: ServicoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Servicos to fetch.
     */
    orderBy?: ServicoOrderByWithRelationInput | ServicoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Servicos.
     */
    cursor?: ServicoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Servicos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Servicos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Servicos.
     */
    distinct?: ServicoScalarFieldEnum | ServicoScalarFieldEnum[]
  }

  /**
   * Servico findFirstOrThrow
   */
  export type ServicoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Servico
     */
    select?: ServicoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServicoInclude<ExtArgs> | null
    /**
     * Filter, which Servico to fetch.
     */
    where?: ServicoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Servicos to fetch.
     */
    orderBy?: ServicoOrderByWithRelationInput | ServicoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Servicos.
     */
    cursor?: ServicoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Servicos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Servicos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Servicos.
     */
    distinct?: ServicoScalarFieldEnum | ServicoScalarFieldEnum[]
  }

  /**
   * Servico findMany
   */
  export type ServicoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Servico
     */
    select?: ServicoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServicoInclude<ExtArgs> | null
    /**
     * Filter, which Servicos to fetch.
     */
    where?: ServicoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Servicos to fetch.
     */
    orderBy?: ServicoOrderByWithRelationInput | ServicoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Servicos.
     */
    cursor?: ServicoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Servicos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Servicos.
     */
    skip?: number
    distinct?: ServicoScalarFieldEnum | ServicoScalarFieldEnum[]
  }

  /**
   * Servico create
   */
  export type ServicoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Servico
     */
    select?: ServicoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServicoInclude<ExtArgs> | null
    /**
     * The data needed to create a Servico.
     */
    data: XOR<ServicoCreateInput, ServicoUncheckedCreateInput>
  }

  /**
   * Servico createMany
   */
  export type ServicoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Servicos.
     */
    data: ServicoCreateManyInput | ServicoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Servico createManyAndReturn
   */
  export type ServicoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Servico
     */
    select?: ServicoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Servicos.
     */
    data: ServicoCreateManyInput | ServicoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Servico update
   */
  export type ServicoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Servico
     */
    select?: ServicoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServicoInclude<ExtArgs> | null
    /**
     * The data needed to update a Servico.
     */
    data: XOR<ServicoUpdateInput, ServicoUncheckedUpdateInput>
    /**
     * Choose, which Servico to update.
     */
    where: ServicoWhereUniqueInput
  }

  /**
   * Servico updateMany
   */
  export type ServicoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Servicos.
     */
    data: XOR<ServicoUpdateManyMutationInput, ServicoUncheckedUpdateManyInput>
    /**
     * Filter which Servicos to update
     */
    where?: ServicoWhereInput
  }

  /**
   * Servico upsert
   */
  export type ServicoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Servico
     */
    select?: ServicoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServicoInclude<ExtArgs> | null
    /**
     * The filter to search for the Servico to update in case it exists.
     */
    where: ServicoWhereUniqueInput
    /**
     * In case the Servico found by the `where` argument doesn't exist, create a new Servico with this data.
     */
    create: XOR<ServicoCreateInput, ServicoUncheckedCreateInput>
    /**
     * In case the Servico was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ServicoUpdateInput, ServicoUncheckedUpdateInput>
  }

  /**
   * Servico delete
   */
  export type ServicoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Servico
     */
    select?: ServicoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServicoInclude<ExtArgs> | null
    /**
     * Filter which Servico to delete.
     */
    where: ServicoWhereUniqueInput
  }

  /**
   * Servico deleteMany
   */
  export type ServicoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Servicos to delete
     */
    where?: ServicoWhereInput
  }

  /**
   * Servico.agendamentos
   */
  export type Servico$agendamentosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgendamentoServico
     */
    select?: AgendamentoServicoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgendamentoServicoInclude<ExtArgs> | null
    where?: AgendamentoServicoWhereInput
    orderBy?: AgendamentoServicoOrderByWithRelationInput | AgendamentoServicoOrderByWithRelationInput[]
    cursor?: AgendamentoServicoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AgendamentoServicoScalarFieldEnum | AgendamentoServicoScalarFieldEnum[]
  }

  /**
   * Servico without action
   */
  export type ServicoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Servico
     */
    select?: ServicoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServicoInclude<ExtArgs> | null
  }


  /**
   * Model Agendamento
   */

  export type AggregateAgendamento = {
    _count: AgendamentoCountAggregateOutputType | null
    _avg: AgendamentoAvgAggregateOutputType | null
    _sum: AgendamentoSumAggregateOutputType | null
    _min: AgendamentoMinAggregateOutputType | null
    _max: AgendamentoMaxAggregateOutputType | null
  }

  export type AgendamentoAvgAggregateOutputType = {
    id: number | null
    idCliente: number | null
    idBarbeiro: number | null
    idFilial: number | null
    valorTotal: Decimal | null
  }

  export type AgendamentoSumAggregateOutputType = {
    id: number | null
    idCliente: number | null
    idBarbeiro: number | null
    idFilial: number | null
    valorTotal: Decimal | null
  }

  export type AgendamentoMinAggregateOutputType = {
    id: number | null
    idCliente: number | null
    idBarbeiro: number | null
    idFilial: number | null
    inicio: Date | null
    fim: Date | null
    status: $Enums.StatusAgendamento | null
    observacao: string | null
    valorTotal: Decimal | null
    dataCriacao: Date | null
  }

  export type AgendamentoMaxAggregateOutputType = {
    id: number | null
    idCliente: number | null
    idBarbeiro: number | null
    idFilial: number | null
    inicio: Date | null
    fim: Date | null
    status: $Enums.StatusAgendamento | null
    observacao: string | null
    valorTotal: Decimal | null
    dataCriacao: Date | null
  }

  export type AgendamentoCountAggregateOutputType = {
    id: number
    idCliente: number
    idBarbeiro: number
    idFilial: number
    inicio: number
    fim: number
    status: number
    observacao: number
    valorTotal: number
    dataCriacao: number
    _all: number
  }


  export type AgendamentoAvgAggregateInputType = {
    id?: true
    idCliente?: true
    idBarbeiro?: true
    idFilial?: true
    valorTotal?: true
  }

  export type AgendamentoSumAggregateInputType = {
    id?: true
    idCliente?: true
    idBarbeiro?: true
    idFilial?: true
    valorTotal?: true
  }

  export type AgendamentoMinAggregateInputType = {
    id?: true
    idCliente?: true
    idBarbeiro?: true
    idFilial?: true
    inicio?: true
    fim?: true
    status?: true
    observacao?: true
    valorTotal?: true
    dataCriacao?: true
  }

  export type AgendamentoMaxAggregateInputType = {
    id?: true
    idCliente?: true
    idBarbeiro?: true
    idFilial?: true
    inicio?: true
    fim?: true
    status?: true
    observacao?: true
    valorTotal?: true
    dataCriacao?: true
  }

  export type AgendamentoCountAggregateInputType = {
    id?: true
    idCliente?: true
    idBarbeiro?: true
    idFilial?: true
    inicio?: true
    fim?: true
    status?: true
    observacao?: true
    valorTotal?: true
    dataCriacao?: true
    _all?: true
  }

  export type AgendamentoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Agendamento to aggregate.
     */
    where?: AgendamentoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Agendamentos to fetch.
     */
    orderBy?: AgendamentoOrderByWithRelationInput | AgendamentoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AgendamentoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Agendamentos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Agendamentos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Agendamentos
    **/
    _count?: true | AgendamentoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AgendamentoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AgendamentoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AgendamentoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AgendamentoMaxAggregateInputType
  }

  export type GetAgendamentoAggregateType<T extends AgendamentoAggregateArgs> = {
        [P in keyof T & keyof AggregateAgendamento]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAgendamento[P]>
      : GetScalarType<T[P], AggregateAgendamento[P]>
  }




  export type AgendamentoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AgendamentoWhereInput
    orderBy?: AgendamentoOrderByWithAggregationInput | AgendamentoOrderByWithAggregationInput[]
    by: AgendamentoScalarFieldEnum[] | AgendamentoScalarFieldEnum
    having?: AgendamentoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AgendamentoCountAggregateInputType | true
    _avg?: AgendamentoAvgAggregateInputType
    _sum?: AgendamentoSumAggregateInputType
    _min?: AgendamentoMinAggregateInputType
    _max?: AgendamentoMaxAggregateInputType
  }

  export type AgendamentoGroupByOutputType = {
    id: number
    idCliente: number
    idBarbeiro: number
    idFilial: number
    inicio: Date
    fim: Date
    status: $Enums.StatusAgendamento
    observacao: string | null
    valorTotal: Decimal
    dataCriacao: Date
    _count: AgendamentoCountAggregateOutputType | null
    _avg: AgendamentoAvgAggregateOutputType | null
    _sum: AgendamentoSumAggregateOutputType | null
    _min: AgendamentoMinAggregateOutputType | null
    _max: AgendamentoMaxAggregateOutputType | null
  }

  type GetAgendamentoGroupByPayload<T extends AgendamentoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AgendamentoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AgendamentoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AgendamentoGroupByOutputType[P]>
            : GetScalarType<T[P], AgendamentoGroupByOutputType[P]>
        }
      >
    >


  export type AgendamentoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    idCliente?: boolean
    idBarbeiro?: boolean
    idFilial?: boolean
    inicio?: boolean
    fim?: boolean
    status?: boolean
    observacao?: boolean
    valorTotal?: boolean
    dataCriacao?: boolean
    cliente?: boolean | ClienteDefaultArgs<ExtArgs>
    barbeiro?: boolean | BarbeiroDefaultArgs<ExtArgs>
    filial?: boolean | FilialDefaultArgs<ExtArgs>
    servicos?: boolean | Agendamento$servicosArgs<ExtArgs>
    _count?: boolean | AgendamentoCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["agendamento"]>

  export type AgendamentoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    idCliente?: boolean
    idBarbeiro?: boolean
    idFilial?: boolean
    inicio?: boolean
    fim?: boolean
    status?: boolean
    observacao?: boolean
    valorTotal?: boolean
    dataCriacao?: boolean
    cliente?: boolean | ClienteDefaultArgs<ExtArgs>
    barbeiro?: boolean | BarbeiroDefaultArgs<ExtArgs>
    filial?: boolean | FilialDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["agendamento"]>

  export type AgendamentoSelectScalar = {
    id?: boolean
    idCliente?: boolean
    idBarbeiro?: boolean
    idFilial?: boolean
    inicio?: boolean
    fim?: boolean
    status?: boolean
    observacao?: boolean
    valorTotal?: boolean
    dataCriacao?: boolean
  }

  export type AgendamentoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cliente?: boolean | ClienteDefaultArgs<ExtArgs>
    barbeiro?: boolean | BarbeiroDefaultArgs<ExtArgs>
    filial?: boolean | FilialDefaultArgs<ExtArgs>
    servicos?: boolean | Agendamento$servicosArgs<ExtArgs>
    _count?: boolean | AgendamentoCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AgendamentoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cliente?: boolean | ClienteDefaultArgs<ExtArgs>
    barbeiro?: boolean | BarbeiroDefaultArgs<ExtArgs>
    filial?: boolean | FilialDefaultArgs<ExtArgs>
  }

  export type $AgendamentoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Agendamento"
    objects: {
      cliente: Prisma.$ClientePayload<ExtArgs>
      barbeiro: Prisma.$BarbeiroPayload<ExtArgs>
      filial: Prisma.$FilialPayload<ExtArgs>
      servicos: Prisma.$AgendamentoServicoPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      idCliente: number
      idBarbeiro: number
      idFilial: number
      inicio: Date
      fim: Date
      status: $Enums.StatusAgendamento
      observacao: string | null
      valorTotal: Prisma.Decimal
      dataCriacao: Date
    }, ExtArgs["result"]["agendamento"]>
    composites: {}
  }

  type AgendamentoGetPayload<S extends boolean | null | undefined | AgendamentoDefaultArgs> = $Result.GetResult<Prisma.$AgendamentoPayload, S>

  type AgendamentoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AgendamentoFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AgendamentoCountAggregateInputType | true
    }

  export interface AgendamentoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Agendamento'], meta: { name: 'Agendamento' } }
    /**
     * Find zero or one Agendamento that matches the filter.
     * @param {AgendamentoFindUniqueArgs} args - Arguments to find a Agendamento
     * @example
     * // Get one Agendamento
     * const agendamento = await prisma.agendamento.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AgendamentoFindUniqueArgs>(args: SelectSubset<T, AgendamentoFindUniqueArgs<ExtArgs>>): Prisma__AgendamentoClient<$Result.GetResult<Prisma.$AgendamentoPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Agendamento that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AgendamentoFindUniqueOrThrowArgs} args - Arguments to find a Agendamento
     * @example
     * // Get one Agendamento
     * const agendamento = await prisma.agendamento.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AgendamentoFindUniqueOrThrowArgs>(args: SelectSubset<T, AgendamentoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AgendamentoClient<$Result.GetResult<Prisma.$AgendamentoPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Agendamento that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgendamentoFindFirstArgs} args - Arguments to find a Agendamento
     * @example
     * // Get one Agendamento
     * const agendamento = await prisma.agendamento.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AgendamentoFindFirstArgs>(args?: SelectSubset<T, AgendamentoFindFirstArgs<ExtArgs>>): Prisma__AgendamentoClient<$Result.GetResult<Prisma.$AgendamentoPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Agendamento that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgendamentoFindFirstOrThrowArgs} args - Arguments to find a Agendamento
     * @example
     * // Get one Agendamento
     * const agendamento = await prisma.agendamento.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AgendamentoFindFirstOrThrowArgs>(args?: SelectSubset<T, AgendamentoFindFirstOrThrowArgs<ExtArgs>>): Prisma__AgendamentoClient<$Result.GetResult<Prisma.$AgendamentoPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Agendamentos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgendamentoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Agendamentos
     * const agendamentos = await prisma.agendamento.findMany()
     * 
     * // Get first 10 Agendamentos
     * const agendamentos = await prisma.agendamento.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const agendamentoWithIdOnly = await prisma.agendamento.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AgendamentoFindManyArgs>(args?: SelectSubset<T, AgendamentoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgendamentoPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Agendamento.
     * @param {AgendamentoCreateArgs} args - Arguments to create a Agendamento.
     * @example
     * // Create one Agendamento
     * const Agendamento = await prisma.agendamento.create({
     *   data: {
     *     // ... data to create a Agendamento
     *   }
     * })
     * 
     */
    create<T extends AgendamentoCreateArgs>(args: SelectSubset<T, AgendamentoCreateArgs<ExtArgs>>): Prisma__AgendamentoClient<$Result.GetResult<Prisma.$AgendamentoPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Agendamentos.
     * @param {AgendamentoCreateManyArgs} args - Arguments to create many Agendamentos.
     * @example
     * // Create many Agendamentos
     * const agendamento = await prisma.agendamento.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AgendamentoCreateManyArgs>(args?: SelectSubset<T, AgendamentoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Agendamentos and returns the data saved in the database.
     * @param {AgendamentoCreateManyAndReturnArgs} args - Arguments to create many Agendamentos.
     * @example
     * // Create many Agendamentos
     * const agendamento = await prisma.agendamento.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Agendamentos and only return the `id`
     * const agendamentoWithIdOnly = await prisma.agendamento.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AgendamentoCreateManyAndReturnArgs>(args?: SelectSubset<T, AgendamentoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgendamentoPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Agendamento.
     * @param {AgendamentoDeleteArgs} args - Arguments to delete one Agendamento.
     * @example
     * // Delete one Agendamento
     * const Agendamento = await prisma.agendamento.delete({
     *   where: {
     *     // ... filter to delete one Agendamento
     *   }
     * })
     * 
     */
    delete<T extends AgendamentoDeleteArgs>(args: SelectSubset<T, AgendamentoDeleteArgs<ExtArgs>>): Prisma__AgendamentoClient<$Result.GetResult<Prisma.$AgendamentoPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Agendamento.
     * @param {AgendamentoUpdateArgs} args - Arguments to update one Agendamento.
     * @example
     * // Update one Agendamento
     * const agendamento = await prisma.agendamento.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AgendamentoUpdateArgs>(args: SelectSubset<T, AgendamentoUpdateArgs<ExtArgs>>): Prisma__AgendamentoClient<$Result.GetResult<Prisma.$AgendamentoPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Agendamentos.
     * @param {AgendamentoDeleteManyArgs} args - Arguments to filter Agendamentos to delete.
     * @example
     * // Delete a few Agendamentos
     * const { count } = await prisma.agendamento.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AgendamentoDeleteManyArgs>(args?: SelectSubset<T, AgendamentoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Agendamentos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgendamentoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Agendamentos
     * const agendamento = await prisma.agendamento.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AgendamentoUpdateManyArgs>(args: SelectSubset<T, AgendamentoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Agendamento.
     * @param {AgendamentoUpsertArgs} args - Arguments to update or create a Agendamento.
     * @example
     * // Update or create a Agendamento
     * const agendamento = await prisma.agendamento.upsert({
     *   create: {
     *     // ... data to create a Agendamento
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Agendamento we want to update
     *   }
     * })
     */
    upsert<T extends AgendamentoUpsertArgs>(args: SelectSubset<T, AgendamentoUpsertArgs<ExtArgs>>): Prisma__AgendamentoClient<$Result.GetResult<Prisma.$AgendamentoPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Agendamentos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgendamentoCountArgs} args - Arguments to filter Agendamentos to count.
     * @example
     * // Count the number of Agendamentos
     * const count = await prisma.agendamento.count({
     *   where: {
     *     // ... the filter for the Agendamentos we want to count
     *   }
     * })
    **/
    count<T extends AgendamentoCountArgs>(
      args?: Subset<T, AgendamentoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AgendamentoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Agendamento.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgendamentoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AgendamentoAggregateArgs>(args: Subset<T, AgendamentoAggregateArgs>): Prisma.PrismaPromise<GetAgendamentoAggregateType<T>>

    /**
     * Group by Agendamento.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgendamentoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AgendamentoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AgendamentoGroupByArgs['orderBy'] }
        : { orderBy?: AgendamentoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AgendamentoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAgendamentoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Agendamento model
   */
  readonly fields: AgendamentoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Agendamento.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AgendamentoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    cliente<T extends ClienteDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ClienteDefaultArgs<ExtArgs>>): Prisma__ClienteClient<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    barbeiro<T extends BarbeiroDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BarbeiroDefaultArgs<ExtArgs>>): Prisma__BarbeiroClient<$Result.GetResult<Prisma.$BarbeiroPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    filial<T extends FilialDefaultArgs<ExtArgs> = {}>(args?: Subset<T, FilialDefaultArgs<ExtArgs>>): Prisma__FilialClient<$Result.GetResult<Prisma.$FilialPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    servicos<T extends Agendamento$servicosArgs<ExtArgs> = {}>(args?: Subset<T, Agendamento$servicosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgendamentoServicoPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Agendamento model
   */ 
  interface AgendamentoFieldRefs {
    readonly id: FieldRef<"Agendamento", 'Int'>
    readonly idCliente: FieldRef<"Agendamento", 'Int'>
    readonly idBarbeiro: FieldRef<"Agendamento", 'Int'>
    readonly idFilial: FieldRef<"Agendamento", 'Int'>
    readonly inicio: FieldRef<"Agendamento", 'DateTime'>
    readonly fim: FieldRef<"Agendamento", 'DateTime'>
    readonly status: FieldRef<"Agendamento", 'StatusAgendamento'>
    readonly observacao: FieldRef<"Agendamento", 'String'>
    readonly valorTotal: FieldRef<"Agendamento", 'Decimal'>
    readonly dataCriacao: FieldRef<"Agendamento", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Agendamento findUnique
   */
  export type AgendamentoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Agendamento
     */
    select?: AgendamentoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgendamentoInclude<ExtArgs> | null
    /**
     * Filter, which Agendamento to fetch.
     */
    where: AgendamentoWhereUniqueInput
  }

  /**
   * Agendamento findUniqueOrThrow
   */
  export type AgendamentoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Agendamento
     */
    select?: AgendamentoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgendamentoInclude<ExtArgs> | null
    /**
     * Filter, which Agendamento to fetch.
     */
    where: AgendamentoWhereUniqueInput
  }

  /**
   * Agendamento findFirst
   */
  export type AgendamentoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Agendamento
     */
    select?: AgendamentoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgendamentoInclude<ExtArgs> | null
    /**
     * Filter, which Agendamento to fetch.
     */
    where?: AgendamentoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Agendamentos to fetch.
     */
    orderBy?: AgendamentoOrderByWithRelationInput | AgendamentoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Agendamentos.
     */
    cursor?: AgendamentoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Agendamentos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Agendamentos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Agendamentos.
     */
    distinct?: AgendamentoScalarFieldEnum | AgendamentoScalarFieldEnum[]
  }

  /**
   * Agendamento findFirstOrThrow
   */
  export type AgendamentoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Agendamento
     */
    select?: AgendamentoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgendamentoInclude<ExtArgs> | null
    /**
     * Filter, which Agendamento to fetch.
     */
    where?: AgendamentoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Agendamentos to fetch.
     */
    orderBy?: AgendamentoOrderByWithRelationInput | AgendamentoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Agendamentos.
     */
    cursor?: AgendamentoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Agendamentos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Agendamentos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Agendamentos.
     */
    distinct?: AgendamentoScalarFieldEnum | AgendamentoScalarFieldEnum[]
  }

  /**
   * Agendamento findMany
   */
  export type AgendamentoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Agendamento
     */
    select?: AgendamentoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgendamentoInclude<ExtArgs> | null
    /**
     * Filter, which Agendamentos to fetch.
     */
    where?: AgendamentoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Agendamentos to fetch.
     */
    orderBy?: AgendamentoOrderByWithRelationInput | AgendamentoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Agendamentos.
     */
    cursor?: AgendamentoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Agendamentos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Agendamentos.
     */
    skip?: number
    distinct?: AgendamentoScalarFieldEnum | AgendamentoScalarFieldEnum[]
  }

  /**
   * Agendamento create
   */
  export type AgendamentoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Agendamento
     */
    select?: AgendamentoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgendamentoInclude<ExtArgs> | null
    /**
     * The data needed to create a Agendamento.
     */
    data: XOR<AgendamentoCreateInput, AgendamentoUncheckedCreateInput>
  }

  /**
   * Agendamento createMany
   */
  export type AgendamentoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Agendamentos.
     */
    data: AgendamentoCreateManyInput | AgendamentoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Agendamento createManyAndReturn
   */
  export type AgendamentoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Agendamento
     */
    select?: AgendamentoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Agendamentos.
     */
    data: AgendamentoCreateManyInput | AgendamentoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgendamentoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Agendamento update
   */
  export type AgendamentoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Agendamento
     */
    select?: AgendamentoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgendamentoInclude<ExtArgs> | null
    /**
     * The data needed to update a Agendamento.
     */
    data: XOR<AgendamentoUpdateInput, AgendamentoUncheckedUpdateInput>
    /**
     * Choose, which Agendamento to update.
     */
    where: AgendamentoWhereUniqueInput
  }

  /**
   * Agendamento updateMany
   */
  export type AgendamentoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Agendamentos.
     */
    data: XOR<AgendamentoUpdateManyMutationInput, AgendamentoUncheckedUpdateManyInput>
    /**
     * Filter which Agendamentos to update
     */
    where?: AgendamentoWhereInput
  }

  /**
   * Agendamento upsert
   */
  export type AgendamentoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Agendamento
     */
    select?: AgendamentoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgendamentoInclude<ExtArgs> | null
    /**
     * The filter to search for the Agendamento to update in case it exists.
     */
    where: AgendamentoWhereUniqueInput
    /**
     * In case the Agendamento found by the `where` argument doesn't exist, create a new Agendamento with this data.
     */
    create: XOR<AgendamentoCreateInput, AgendamentoUncheckedCreateInput>
    /**
     * In case the Agendamento was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AgendamentoUpdateInput, AgendamentoUncheckedUpdateInput>
  }

  /**
   * Agendamento delete
   */
  export type AgendamentoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Agendamento
     */
    select?: AgendamentoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgendamentoInclude<ExtArgs> | null
    /**
     * Filter which Agendamento to delete.
     */
    where: AgendamentoWhereUniqueInput
  }

  /**
   * Agendamento deleteMany
   */
  export type AgendamentoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Agendamentos to delete
     */
    where?: AgendamentoWhereInput
  }

  /**
   * Agendamento.servicos
   */
  export type Agendamento$servicosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgendamentoServico
     */
    select?: AgendamentoServicoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgendamentoServicoInclude<ExtArgs> | null
    where?: AgendamentoServicoWhereInput
    orderBy?: AgendamentoServicoOrderByWithRelationInput | AgendamentoServicoOrderByWithRelationInput[]
    cursor?: AgendamentoServicoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AgendamentoServicoScalarFieldEnum | AgendamentoServicoScalarFieldEnum[]
  }

  /**
   * Agendamento without action
   */
  export type AgendamentoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Agendamento
     */
    select?: AgendamentoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgendamentoInclude<ExtArgs> | null
  }


  /**
   * Model AgendamentoServico
   */

  export type AggregateAgendamentoServico = {
    _count: AgendamentoServicoCountAggregateOutputType | null
    _avg: AgendamentoServicoAvgAggregateOutputType | null
    _sum: AgendamentoServicoSumAggregateOutputType | null
    _min: AgendamentoServicoMinAggregateOutputType | null
    _max: AgendamentoServicoMaxAggregateOutputType | null
  }

  export type AgendamentoServicoAvgAggregateOutputType = {
    id: number | null
    idAgendamento: number | null
    idServico: number | null
    preco: Decimal | null
    duracaoMinutos: number | null
  }

  export type AgendamentoServicoSumAggregateOutputType = {
    id: number | null
    idAgendamento: number | null
    idServico: number | null
    preco: Decimal | null
    duracaoMinutos: number | null
  }

  export type AgendamentoServicoMinAggregateOutputType = {
    id: number | null
    idAgendamento: number | null
    idServico: number | null
    preco: Decimal | null
    duracaoMinutos: number | null
  }

  export type AgendamentoServicoMaxAggregateOutputType = {
    id: number | null
    idAgendamento: number | null
    idServico: number | null
    preco: Decimal | null
    duracaoMinutos: number | null
  }

  export type AgendamentoServicoCountAggregateOutputType = {
    id: number
    idAgendamento: number
    idServico: number
    preco: number
    duracaoMinutos: number
    _all: number
  }


  export type AgendamentoServicoAvgAggregateInputType = {
    id?: true
    idAgendamento?: true
    idServico?: true
    preco?: true
    duracaoMinutos?: true
  }

  export type AgendamentoServicoSumAggregateInputType = {
    id?: true
    idAgendamento?: true
    idServico?: true
    preco?: true
    duracaoMinutos?: true
  }

  export type AgendamentoServicoMinAggregateInputType = {
    id?: true
    idAgendamento?: true
    idServico?: true
    preco?: true
    duracaoMinutos?: true
  }

  export type AgendamentoServicoMaxAggregateInputType = {
    id?: true
    idAgendamento?: true
    idServico?: true
    preco?: true
    duracaoMinutos?: true
  }

  export type AgendamentoServicoCountAggregateInputType = {
    id?: true
    idAgendamento?: true
    idServico?: true
    preco?: true
    duracaoMinutos?: true
    _all?: true
  }

  export type AgendamentoServicoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AgendamentoServico to aggregate.
     */
    where?: AgendamentoServicoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgendamentoServicos to fetch.
     */
    orderBy?: AgendamentoServicoOrderByWithRelationInput | AgendamentoServicoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AgendamentoServicoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgendamentoServicos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgendamentoServicos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AgendamentoServicos
    **/
    _count?: true | AgendamentoServicoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AgendamentoServicoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AgendamentoServicoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AgendamentoServicoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AgendamentoServicoMaxAggregateInputType
  }

  export type GetAgendamentoServicoAggregateType<T extends AgendamentoServicoAggregateArgs> = {
        [P in keyof T & keyof AggregateAgendamentoServico]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAgendamentoServico[P]>
      : GetScalarType<T[P], AggregateAgendamentoServico[P]>
  }




  export type AgendamentoServicoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AgendamentoServicoWhereInput
    orderBy?: AgendamentoServicoOrderByWithAggregationInput | AgendamentoServicoOrderByWithAggregationInput[]
    by: AgendamentoServicoScalarFieldEnum[] | AgendamentoServicoScalarFieldEnum
    having?: AgendamentoServicoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AgendamentoServicoCountAggregateInputType | true
    _avg?: AgendamentoServicoAvgAggregateInputType
    _sum?: AgendamentoServicoSumAggregateInputType
    _min?: AgendamentoServicoMinAggregateInputType
    _max?: AgendamentoServicoMaxAggregateInputType
  }

  export type AgendamentoServicoGroupByOutputType = {
    id: number
    idAgendamento: number
    idServico: number
    preco: Decimal
    duracaoMinutos: number
    _count: AgendamentoServicoCountAggregateOutputType | null
    _avg: AgendamentoServicoAvgAggregateOutputType | null
    _sum: AgendamentoServicoSumAggregateOutputType | null
    _min: AgendamentoServicoMinAggregateOutputType | null
    _max: AgendamentoServicoMaxAggregateOutputType | null
  }

  type GetAgendamentoServicoGroupByPayload<T extends AgendamentoServicoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AgendamentoServicoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AgendamentoServicoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AgendamentoServicoGroupByOutputType[P]>
            : GetScalarType<T[P], AgendamentoServicoGroupByOutputType[P]>
        }
      >
    >


  export type AgendamentoServicoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    idAgendamento?: boolean
    idServico?: boolean
    preco?: boolean
    duracaoMinutos?: boolean
    agendamento?: boolean | AgendamentoDefaultArgs<ExtArgs>
    servico?: boolean | ServicoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["agendamentoServico"]>

  export type AgendamentoServicoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    idAgendamento?: boolean
    idServico?: boolean
    preco?: boolean
    duracaoMinutos?: boolean
    agendamento?: boolean | AgendamentoDefaultArgs<ExtArgs>
    servico?: boolean | ServicoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["agendamentoServico"]>

  export type AgendamentoServicoSelectScalar = {
    id?: boolean
    idAgendamento?: boolean
    idServico?: boolean
    preco?: boolean
    duracaoMinutos?: boolean
  }

  export type AgendamentoServicoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    agendamento?: boolean | AgendamentoDefaultArgs<ExtArgs>
    servico?: boolean | ServicoDefaultArgs<ExtArgs>
  }
  export type AgendamentoServicoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    agendamento?: boolean | AgendamentoDefaultArgs<ExtArgs>
    servico?: boolean | ServicoDefaultArgs<ExtArgs>
  }

  export type $AgendamentoServicoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AgendamentoServico"
    objects: {
      agendamento: Prisma.$AgendamentoPayload<ExtArgs>
      servico: Prisma.$ServicoPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      idAgendamento: number
      idServico: number
      preco: Prisma.Decimal
      duracaoMinutos: number
    }, ExtArgs["result"]["agendamentoServico"]>
    composites: {}
  }

  type AgendamentoServicoGetPayload<S extends boolean | null | undefined | AgendamentoServicoDefaultArgs> = $Result.GetResult<Prisma.$AgendamentoServicoPayload, S>

  type AgendamentoServicoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AgendamentoServicoFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AgendamentoServicoCountAggregateInputType | true
    }

  export interface AgendamentoServicoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AgendamentoServico'], meta: { name: 'AgendamentoServico' } }
    /**
     * Find zero or one AgendamentoServico that matches the filter.
     * @param {AgendamentoServicoFindUniqueArgs} args - Arguments to find a AgendamentoServico
     * @example
     * // Get one AgendamentoServico
     * const agendamentoServico = await prisma.agendamentoServico.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AgendamentoServicoFindUniqueArgs>(args: SelectSubset<T, AgendamentoServicoFindUniqueArgs<ExtArgs>>): Prisma__AgendamentoServicoClient<$Result.GetResult<Prisma.$AgendamentoServicoPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one AgendamentoServico that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AgendamentoServicoFindUniqueOrThrowArgs} args - Arguments to find a AgendamentoServico
     * @example
     * // Get one AgendamentoServico
     * const agendamentoServico = await prisma.agendamentoServico.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AgendamentoServicoFindUniqueOrThrowArgs>(args: SelectSubset<T, AgendamentoServicoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AgendamentoServicoClient<$Result.GetResult<Prisma.$AgendamentoServicoPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first AgendamentoServico that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgendamentoServicoFindFirstArgs} args - Arguments to find a AgendamentoServico
     * @example
     * // Get one AgendamentoServico
     * const agendamentoServico = await prisma.agendamentoServico.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AgendamentoServicoFindFirstArgs>(args?: SelectSubset<T, AgendamentoServicoFindFirstArgs<ExtArgs>>): Prisma__AgendamentoServicoClient<$Result.GetResult<Prisma.$AgendamentoServicoPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first AgendamentoServico that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgendamentoServicoFindFirstOrThrowArgs} args - Arguments to find a AgendamentoServico
     * @example
     * // Get one AgendamentoServico
     * const agendamentoServico = await prisma.agendamentoServico.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AgendamentoServicoFindFirstOrThrowArgs>(args?: SelectSubset<T, AgendamentoServicoFindFirstOrThrowArgs<ExtArgs>>): Prisma__AgendamentoServicoClient<$Result.GetResult<Prisma.$AgendamentoServicoPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more AgendamentoServicos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgendamentoServicoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AgendamentoServicos
     * const agendamentoServicos = await prisma.agendamentoServico.findMany()
     * 
     * // Get first 10 AgendamentoServicos
     * const agendamentoServicos = await prisma.agendamentoServico.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const agendamentoServicoWithIdOnly = await prisma.agendamentoServico.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AgendamentoServicoFindManyArgs>(args?: SelectSubset<T, AgendamentoServicoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgendamentoServicoPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a AgendamentoServico.
     * @param {AgendamentoServicoCreateArgs} args - Arguments to create a AgendamentoServico.
     * @example
     * // Create one AgendamentoServico
     * const AgendamentoServico = await prisma.agendamentoServico.create({
     *   data: {
     *     // ... data to create a AgendamentoServico
     *   }
     * })
     * 
     */
    create<T extends AgendamentoServicoCreateArgs>(args: SelectSubset<T, AgendamentoServicoCreateArgs<ExtArgs>>): Prisma__AgendamentoServicoClient<$Result.GetResult<Prisma.$AgendamentoServicoPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many AgendamentoServicos.
     * @param {AgendamentoServicoCreateManyArgs} args - Arguments to create many AgendamentoServicos.
     * @example
     * // Create many AgendamentoServicos
     * const agendamentoServico = await prisma.agendamentoServico.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AgendamentoServicoCreateManyArgs>(args?: SelectSubset<T, AgendamentoServicoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AgendamentoServicos and returns the data saved in the database.
     * @param {AgendamentoServicoCreateManyAndReturnArgs} args - Arguments to create many AgendamentoServicos.
     * @example
     * // Create many AgendamentoServicos
     * const agendamentoServico = await prisma.agendamentoServico.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AgendamentoServicos and only return the `id`
     * const agendamentoServicoWithIdOnly = await prisma.agendamentoServico.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AgendamentoServicoCreateManyAndReturnArgs>(args?: SelectSubset<T, AgendamentoServicoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgendamentoServicoPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a AgendamentoServico.
     * @param {AgendamentoServicoDeleteArgs} args - Arguments to delete one AgendamentoServico.
     * @example
     * // Delete one AgendamentoServico
     * const AgendamentoServico = await prisma.agendamentoServico.delete({
     *   where: {
     *     // ... filter to delete one AgendamentoServico
     *   }
     * })
     * 
     */
    delete<T extends AgendamentoServicoDeleteArgs>(args: SelectSubset<T, AgendamentoServicoDeleteArgs<ExtArgs>>): Prisma__AgendamentoServicoClient<$Result.GetResult<Prisma.$AgendamentoServicoPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one AgendamentoServico.
     * @param {AgendamentoServicoUpdateArgs} args - Arguments to update one AgendamentoServico.
     * @example
     * // Update one AgendamentoServico
     * const agendamentoServico = await prisma.agendamentoServico.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AgendamentoServicoUpdateArgs>(args: SelectSubset<T, AgendamentoServicoUpdateArgs<ExtArgs>>): Prisma__AgendamentoServicoClient<$Result.GetResult<Prisma.$AgendamentoServicoPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more AgendamentoServicos.
     * @param {AgendamentoServicoDeleteManyArgs} args - Arguments to filter AgendamentoServicos to delete.
     * @example
     * // Delete a few AgendamentoServicos
     * const { count } = await prisma.agendamentoServico.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AgendamentoServicoDeleteManyArgs>(args?: SelectSubset<T, AgendamentoServicoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AgendamentoServicos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgendamentoServicoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AgendamentoServicos
     * const agendamentoServico = await prisma.agendamentoServico.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AgendamentoServicoUpdateManyArgs>(args: SelectSubset<T, AgendamentoServicoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AgendamentoServico.
     * @param {AgendamentoServicoUpsertArgs} args - Arguments to update or create a AgendamentoServico.
     * @example
     * // Update or create a AgendamentoServico
     * const agendamentoServico = await prisma.agendamentoServico.upsert({
     *   create: {
     *     // ... data to create a AgendamentoServico
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AgendamentoServico we want to update
     *   }
     * })
     */
    upsert<T extends AgendamentoServicoUpsertArgs>(args: SelectSubset<T, AgendamentoServicoUpsertArgs<ExtArgs>>): Prisma__AgendamentoServicoClient<$Result.GetResult<Prisma.$AgendamentoServicoPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of AgendamentoServicos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgendamentoServicoCountArgs} args - Arguments to filter AgendamentoServicos to count.
     * @example
     * // Count the number of AgendamentoServicos
     * const count = await prisma.agendamentoServico.count({
     *   where: {
     *     // ... the filter for the AgendamentoServicos we want to count
     *   }
     * })
    **/
    count<T extends AgendamentoServicoCountArgs>(
      args?: Subset<T, AgendamentoServicoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AgendamentoServicoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AgendamentoServico.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgendamentoServicoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AgendamentoServicoAggregateArgs>(args: Subset<T, AgendamentoServicoAggregateArgs>): Prisma.PrismaPromise<GetAgendamentoServicoAggregateType<T>>

    /**
     * Group by AgendamentoServico.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgendamentoServicoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AgendamentoServicoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AgendamentoServicoGroupByArgs['orderBy'] }
        : { orderBy?: AgendamentoServicoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AgendamentoServicoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAgendamentoServicoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AgendamentoServico model
   */
  readonly fields: AgendamentoServicoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AgendamentoServico.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AgendamentoServicoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    agendamento<T extends AgendamentoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AgendamentoDefaultArgs<ExtArgs>>): Prisma__AgendamentoClient<$Result.GetResult<Prisma.$AgendamentoPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    servico<T extends ServicoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ServicoDefaultArgs<ExtArgs>>): Prisma__ServicoClient<$Result.GetResult<Prisma.$ServicoPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AgendamentoServico model
   */ 
  interface AgendamentoServicoFieldRefs {
    readonly id: FieldRef<"AgendamentoServico", 'Int'>
    readonly idAgendamento: FieldRef<"AgendamentoServico", 'Int'>
    readonly idServico: FieldRef<"AgendamentoServico", 'Int'>
    readonly preco: FieldRef<"AgendamentoServico", 'Decimal'>
    readonly duracaoMinutos: FieldRef<"AgendamentoServico", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * AgendamentoServico findUnique
   */
  export type AgendamentoServicoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgendamentoServico
     */
    select?: AgendamentoServicoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgendamentoServicoInclude<ExtArgs> | null
    /**
     * Filter, which AgendamentoServico to fetch.
     */
    where: AgendamentoServicoWhereUniqueInput
  }

  /**
   * AgendamentoServico findUniqueOrThrow
   */
  export type AgendamentoServicoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgendamentoServico
     */
    select?: AgendamentoServicoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgendamentoServicoInclude<ExtArgs> | null
    /**
     * Filter, which AgendamentoServico to fetch.
     */
    where: AgendamentoServicoWhereUniqueInput
  }

  /**
   * AgendamentoServico findFirst
   */
  export type AgendamentoServicoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgendamentoServico
     */
    select?: AgendamentoServicoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgendamentoServicoInclude<ExtArgs> | null
    /**
     * Filter, which AgendamentoServico to fetch.
     */
    where?: AgendamentoServicoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgendamentoServicos to fetch.
     */
    orderBy?: AgendamentoServicoOrderByWithRelationInput | AgendamentoServicoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AgendamentoServicos.
     */
    cursor?: AgendamentoServicoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgendamentoServicos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgendamentoServicos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AgendamentoServicos.
     */
    distinct?: AgendamentoServicoScalarFieldEnum | AgendamentoServicoScalarFieldEnum[]
  }

  /**
   * AgendamentoServico findFirstOrThrow
   */
  export type AgendamentoServicoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgendamentoServico
     */
    select?: AgendamentoServicoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgendamentoServicoInclude<ExtArgs> | null
    /**
     * Filter, which AgendamentoServico to fetch.
     */
    where?: AgendamentoServicoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgendamentoServicos to fetch.
     */
    orderBy?: AgendamentoServicoOrderByWithRelationInput | AgendamentoServicoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AgendamentoServicos.
     */
    cursor?: AgendamentoServicoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgendamentoServicos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgendamentoServicos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AgendamentoServicos.
     */
    distinct?: AgendamentoServicoScalarFieldEnum | AgendamentoServicoScalarFieldEnum[]
  }

  /**
   * AgendamentoServico findMany
   */
  export type AgendamentoServicoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgendamentoServico
     */
    select?: AgendamentoServicoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgendamentoServicoInclude<ExtArgs> | null
    /**
     * Filter, which AgendamentoServicos to fetch.
     */
    where?: AgendamentoServicoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgendamentoServicos to fetch.
     */
    orderBy?: AgendamentoServicoOrderByWithRelationInput | AgendamentoServicoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AgendamentoServicos.
     */
    cursor?: AgendamentoServicoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgendamentoServicos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgendamentoServicos.
     */
    skip?: number
    distinct?: AgendamentoServicoScalarFieldEnum | AgendamentoServicoScalarFieldEnum[]
  }

  /**
   * AgendamentoServico create
   */
  export type AgendamentoServicoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgendamentoServico
     */
    select?: AgendamentoServicoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgendamentoServicoInclude<ExtArgs> | null
    /**
     * The data needed to create a AgendamentoServico.
     */
    data: XOR<AgendamentoServicoCreateInput, AgendamentoServicoUncheckedCreateInput>
  }

  /**
   * AgendamentoServico createMany
   */
  export type AgendamentoServicoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AgendamentoServicos.
     */
    data: AgendamentoServicoCreateManyInput | AgendamentoServicoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AgendamentoServico createManyAndReturn
   */
  export type AgendamentoServicoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgendamentoServico
     */
    select?: AgendamentoServicoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many AgendamentoServicos.
     */
    data: AgendamentoServicoCreateManyInput | AgendamentoServicoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgendamentoServicoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AgendamentoServico update
   */
  export type AgendamentoServicoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgendamentoServico
     */
    select?: AgendamentoServicoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgendamentoServicoInclude<ExtArgs> | null
    /**
     * The data needed to update a AgendamentoServico.
     */
    data: XOR<AgendamentoServicoUpdateInput, AgendamentoServicoUncheckedUpdateInput>
    /**
     * Choose, which AgendamentoServico to update.
     */
    where: AgendamentoServicoWhereUniqueInput
  }

  /**
   * AgendamentoServico updateMany
   */
  export type AgendamentoServicoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AgendamentoServicos.
     */
    data: XOR<AgendamentoServicoUpdateManyMutationInput, AgendamentoServicoUncheckedUpdateManyInput>
    /**
     * Filter which AgendamentoServicos to update
     */
    where?: AgendamentoServicoWhereInput
  }

  /**
   * AgendamentoServico upsert
   */
  export type AgendamentoServicoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgendamentoServico
     */
    select?: AgendamentoServicoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgendamentoServicoInclude<ExtArgs> | null
    /**
     * The filter to search for the AgendamentoServico to update in case it exists.
     */
    where: AgendamentoServicoWhereUniqueInput
    /**
     * In case the AgendamentoServico found by the `where` argument doesn't exist, create a new AgendamentoServico with this data.
     */
    create: XOR<AgendamentoServicoCreateInput, AgendamentoServicoUncheckedCreateInput>
    /**
     * In case the AgendamentoServico was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AgendamentoServicoUpdateInput, AgendamentoServicoUncheckedUpdateInput>
  }

  /**
   * AgendamentoServico delete
   */
  export type AgendamentoServicoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgendamentoServico
     */
    select?: AgendamentoServicoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgendamentoServicoInclude<ExtArgs> | null
    /**
     * Filter which AgendamentoServico to delete.
     */
    where: AgendamentoServicoWhereUniqueInput
  }

  /**
   * AgendamentoServico deleteMany
   */
  export type AgendamentoServicoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AgendamentoServicos to delete
     */
    where?: AgendamentoServicoWhereInput
  }

  /**
   * AgendamentoServico without action
   */
  export type AgendamentoServicoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgendamentoServico
     */
    select?: AgendamentoServicoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgendamentoServicoInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UsuarioScalarFieldEnum: {
    id: 'id',
    nome: 'nome',
    email: 'email',
    senha: 'senha',
    dataCadastro: 'dataCadastro',
    tipoPerfil: 'tipoPerfil',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UsuarioScalarFieldEnum = (typeof UsuarioScalarFieldEnum)[keyof typeof UsuarioScalarFieldEnum]


  export const ClienteScalarFieldEnum: {
    id: 'id',
    cpf: 'cpf',
    dataNascimento: 'dataNascimento'
  };

  export type ClienteScalarFieldEnum = (typeof ClienteScalarFieldEnum)[keyof typeof ClienteScalarFieldEnum]


  export const BarbeiroScalarFieldEnum: {
    id: 'id',
    descricao: 'descricao',
    dataAdmissao: 'dataAdmissao',
    status: 'status',
    idFilial: 'idFilial'
  };

  export type BarbeiroScalarFieldEnum = (typeof BarbeiroScalarFieldEnum)[keyof typeof BarbeiroScalarFieldEnum]


  export const FilialScalarFieldEnum: {
    id: 'id',
    nome: 'nome',
    cnpj: 'cnpj',
    telefone: 'telefone',
    email: 'email',
    horarioAbertura: 'horarioAbertura',
    horarioFechamento: 'horarioFechamento',
    idEndereco: 'idEndereco'
  };

  export type FilialScalarFieldEnum = (typeof FilialScalarFieldEnum)[keyof typeof FilialScalarFieldEnum]


  export const EnderecoScalarFieldEnum: {
    id: 'id',
    cep: 'cep',
    logradouro: 'logradouro',
    numero: 'numero',
    bairro: 'bairro',
    cidade: 'cidade',
    estado: 'estado'
  };

  export type EnderecoScalarFieldEnum = (typeof EnderecoScalarFieldEnum)[keyof typeof EnderecoScalarFieldEnum]


  export const ServicoScalarFieldEnum: {
    id: 'id',
    nome: 'nome',
    descricao: 'descricao',
    preco: 'preco',
    duracaoMinutos: 'duracaoMinutos'
  };

  export type ServicoScalarFieldEnum = (typeof ServicoScalarFieldEnum)[keyof typeof ServicoScalarFieldEnum]


  export const AgendamentoScalarFieldEnum: {
    id: 'id',
    idCliente: 'idCliente',
    idBarbeiro: 'idBarbeiro',
    idFilial: 'idFilial',
    inicio: 'inicio',
    fim: 'fim',
    status: 'status',
    observacao: 'observacao',
    valorTotal: 'valorTotal',
    dataCriacao: 'dataCriacao'
  };

  export type AgendamentoScalarFieldEnum = (typeof AgendamentoScalarFieldEnum)[keyof typeof AgendamentoScalarFieldEnum]


  export const AgendamentoServicoScalarFieldEnum: {
    id: 'id',
    idAgendamento: 'idAgendamento',
    idServico: 'idServico',
    preco: 'preco',
    duracaoMinutos: 'duracaoMinutos'
  };

  export type AgendamentoServicoScalarFieldEnum = (typeof AgendamentoServicoScalarFieldEnum)[keyof typeof AgendamentoServicoScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'TipoPerfil'
   */
  export type EnumTipoPerfilFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TipoPerfil'>
    


  /**
   * Reference to a field of type 'TipoPerfil[]'
   */
  export type ListEnumTipoPerfilFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TipoPerfil[]'>
    


  /**
   * Reference to a field of type 'StatusBarbeiro'
   */
  export type EnumStatusBarbeiroFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StatusBarbeiro'>
    


  /**
   * Reference to a field of type 'StatusBarbeiro[]'
   */
  export type ListEnumStatusBarbeiroFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StatusBarbeiro[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'StatusAgendamento'
   */
  export type EnumStatusAgendamentoFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StatusAgendamento'>
    


  /**
   * Reference to a field of type 'StatusAgendamento[]'
   */
  export type ListEnumStatusAgendamentoFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StatusAgendamento[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UsuarioWhereInput = {
    AND?: UsuarioWhereInput | UsuarioWhereInput[]
    OR?: UsuarioWhereInput[]
    NOT?: UsuarioWhereInput | UsuarioWhereInput[]
    id?: IntFilter<"Usuario"> | number
    nome?: StringFilter<"Usuario"> | string
    email?: StringFilter<"Usuario"> | string
    senha?: StringFilter<"Usuario"> | string
    dataCadastro?: DateTimeFilter<"Usuario"> | Date | string
    tipoPerfil?: EnumTipoPerfilFilter<"Usuario"> | $Enums.TipoPerfil
    createdAt?: DateTimeFilter<"Usuario"> | Date | string
    updatedAt?: DateTimeFilter<"Usuario"> | Date | string
    cliente?: XOR<ClienteNullableRelationFilter, ClienteWhereInput> | null
    barbeiro?: XOR<BarbeiroNullableRelationFilter, BarbeiroWhereInput> | null
  }

  export type UsuarioOrderByWithRelationInput = {
    id?: SortOrder
    nome?: SortOrder
    email?: SortOrder
    senha?: SortOrder
    dataCadastro?: SortOrder
    tipoPerfil?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    cliente?: ClienteOrderByWithRelationInput
    barbeiro?: BarbeiroOrderByWithRelationInput
  }

  export type UsuarioWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    email?: string
    AND?: UsuarioWhereInput | UsuarioWhereInput[]
    OR?: UsuarioWhereInput[]
    NOT?: UsuarioWhereInput | UsuarioWhereInput[]
    nome?: StringFilter<"Usuario"> | string
    senha?: StringFilter<"Usuario"> | string
    dataCadastro?: DateTimeFilter<"Usuario"> | Date | string
    tipoPerfil?: EnumTipoPerfilFilter<"Usuario"> | $Enums.TipoPerfil
    createdAt?: DateTimeFilter<"Usuario"> | Date | string
    updatedAt?: DateTimeFilter<"Usuario"> | Date | string
    cliente?: XOR<ClienteNullableRelationFilter, ClienteWhereInput> | null
    barbeiro?: XOR<BarbeiroNullableRelationFilter, BarbeiroWhereInput> | null
  }, "id" | "email">

  export type UsuarioOrderByWithAggregationInput = {
    id?: SortOrder
    nome?: SortOrder
    email?: SortOrder
    senha?: SortOrder
    dataCadastro?: SortOrder
    tipoPerfil?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UsuarioCountOrderByAggregateInput
    _avg?: UsuarioAvgOrderByAggregateInput
    _max?: UsuarioMaxOrderByAggregateInput
    _min?: UsuarioMinOrderByAggregateInput
    _sum?: UsuarioSumOrderByAggregateInput
  }

  export type UsuarioScalarWhereWithAggregatesInput = {
    AND?: UsuarioScalarWhereWithAggregatesInput | UsuarioScalarWhereWithAggregatesInput[]
    OR?: UsuarioScalarWhereWithAggregatesInput[]
    NOT?: UsuarioScalarWhereWithAggregatesInput | UsuarioScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Usuario"> | number
    nome?: StringWithAggregatesFilter<"Usuario"> | string
    email?: StringWithAggregatesFilter<"Usuario"> | string
    senha?: StringWithAggregatesFilter<"Usuario"> | string
    dataCadastro?: DateTimeWithAggregatesFilter<"Usuario"> | Date | string
    tipoPerfil?: EnumTipoPerfilWithAggregatesFilter<"Usuario"> | $Enums.TipoPerfil
    createdAt?: DateTimeWithAggregatesFilter<"Usuario"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Usuario"> | Date | string
  }

  export type ClienteWhereInput = {
    AND?: ClienteWhereInput | ClienteWhereInput[]
    OR?: ClienteWhereInput[]
    NOT?: ClienteWhereInput | ClienteWhereInput[]
    id?: IntFilter<"Cliente"> | number
    cpf?: StringFilter<"Cliente"> | string
    dataNascimento?: DateTimeNullableFilter<"Cliente"> | Date | string | null
    usuario?: XOR<UsuarioRelationFilter, UsuarioWhereInput>
    agendamentos?: AgendamentoListRelationFilter
  }

  export type ClienteOrderByWithRelationInput = {
    id?: SortOrder
    cpf?: SortOrder
    dataNascimento?: SortOrderInput | SortOrder
    usuario?: UsuarioOrderByWithRelationInput
    agendamentos?: AgendamentoOrderByRelationAggregateInput
  }

  export type ClienteWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    cpf?: string
    AND?: ClienteWhereInput | ClienteWhereInput[]
    OR?: ClienteWhereInput[]
    NOT?: ClienteWhereInput | ClienteWhereInput[]
    dataNascimento?: DateTimeNullableFilter<"Cliente"> | Date | string | null
    usuario?: XOR<UsuarioRelationFilter, UsuarioWhereInput>
    agendamentos?: AgendamentoListRelationFilter
  }, "id" | "cpf">

  export type ClienteOrderByWithAggregationInput = {
    id?: SortOrder
    cpf?: SortOrder
    dataNascimento?: SortOrderInput | SortOrder
    _count?: ClienteCountOrderByAggregateInput
    _avg?: ClienteAvgOrderByAggregateInput
    _max?: ClienteMaxOrderByAggregateInput
    _min?: ClienteMinOrderByAggregateInput
    _sum?: ClienteSumOrderByAggregateInput
  }

  export type ClienteScalarWhereWithAggregatesInput = {
    AND?: ClienteScalarWhereWithAggregatesInput | ClienteScalarWhereWithAggregatesInput[]
    OR?: ClienteScalarWhereWithAggregatesInput[]
    NOT?: ClienteScalarWhereWithAggregatesInput | ClienteScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Cliente"> | number
    cpf?: StringWithAggregatesFilter<"Cliente"> | string
    dataNascimento?: DateTimeNullableWithAggregatesFilter<"Cliente"> | Date | string | null
  }

  export type BarbeiroWhereInput = {
    AND?: BarbeiroWhereInput | BarbeiroWhereInput[]
    OR?: BarbeiroWhereInput[]
    NOT?: BarbeiroWhereInput | BarbeiroWhereInput[]
    id?: IntFilter<"Barbeiro"> | number
    descricao?: StringNullableFilter<"Barbeiro"> | string | null
    dataAdmissao?: DateTimeNullableFilter<"Barbeiro"> | Date | string | null
    status?: EnumStatusBarbeiroFilter<"Barbeiro"> | $Enums.StatusBarbeiro
    idFilial?: IntFilter<"Barbeiro"> | number
    filial?: XOR<FilialRelationFilter, FilialWhereInput>
    usuario?: XOR<UsuarioRelationFilter, UsuarioWhereInput>
    agendamentos?: AgendamentoListRelationFilter
  }

  export type BarbeiroOrderByWithRelationInput = {
    id?: SortOrder
    descricao?: SortOrderInput | SortOrder
    dataAdmissao?: SortOrderInput | SortOrder
    status?: SortOrder
    idFilial?: SortOrder
    filial?: FilialOrderByWithRelationInput
    usuario?: UsuarioOrderByWithRelationInput
    agendamentos?: AgendamentoOrderByRelationAggregateInput
  }

  export type BarbeiroWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: BarbeiroWhereInput | BarbeiroWhereInput[]
    OR?: BarbeiroWhereInput[]
    NOT?: BarbeiroWhereInput | BarbeiroWhereInput[]
    descricao?: StringNullableFilter<"Barbeiro"> | string | null
    dataAdmissao?: DateTimeNullableFilter<"Barbeiro"> | Date | string | null
    status?: EnumStatusBarbeiroFilter<"Barbeiro"> | $Enums.StatusBarbeiro
    idFilial?: IntFilter<"Barbeiro"> | number
    filial?: XOR<FilialRelationFilter, FilialWhereInput>
    usuario?: XOR<UsuarioRelationFilter, UsuarioWhereInput>
    agendamentos?: AgendamentoListRelationFilter
  }, "id">

  export type BarbeiroOrderByWithAggregationInput = {
    id?: SortOrder
    descricao?: SortOrderInput | SortOrder
    dataAdmissao?: SortOrderInput | SortOrder
    status?: SortOrder
    idFilial?: SortOrder
    _count?: BarbeiroCountOrderByAggregateInput
    _avg?: BarbeiroAvgOrderByAggregateInput
    _max?: BarbeiroMaxOrderByAggregateInput
    _min?: BarbeiroMinOrderByAggregateInput
    _sum?: BarbeiroSumOrderByAggregateInput
  }

  export type BarbeiroScalarWhereWithAggregatesInput = {
    AND?: BarbeiroScalarWhereWithAggregatesInput | BarbeiroScalarWhereWithAggregatesInput[]
    OR?: BarbeiroScalarWhereWithAggregatesInput[]
    NOT?: BarbeiroScalarWhereWithAggregatesInput | BarbeiroScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Barbeiro"> | number
    descricao?: StringNullableWithAggregatesFilter<"Barbeiro"> | string | null
    dataAdmissao?: DateTimeNullableWithAggregatesFilter<"Barbeiro"> | Date | string | null
    status?: EnumStatusBarbeiroWithAggregatesFilter<"Barbeiro"> | $Enums.StatusBarbeiro
    idFilial?: IntWithAggregatesFilter<"Barbeiro"> | number
  }

  export type FilialWhereInput = {
    AND?: FilialWhereInput | FilialWhereInput[]
    OR?: FilialWhereInput[]
    NOT?: FilialWhereInput | FilialWhereInput[]
    id?: IntFilter<"Filial"> | number
    nome?: StringFilter<"Filial"> | string
    cnpj?: StringFilter<"Filial"> | string
    telefone?: StringNullableFilter<"Filial"> | string | null
    email?: StringNullableFilter<"Filial"> | string | null
    horarioAbertura?: StringNullableFilter<"Filial"> | string | null
    horarioFechamento?: StringNullableFilter<"Filial"> | string | null
    idEndereco?: IntFilter<"Filial"> | number
    endereco?: XOR<EnderecoRelationFilter, EnderecoWhereInput>
    barbeiros?: BarbeiroListRelationFilter
    agendamentos?: AgendamentoListRelationFilter
  }

  export type FilialOrderByWithRelationInput = {
    id?: SortOrder
    nome?: SortOrder
    cnpj?: SortOrder
    telefone?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    horarioAbertura?: SortOrderInput | SortOrder
    horarioFechamento?: SortOrderInput | SortOrder
    idEndereco?: SortOrder
    endereco?: EnderecoOrderByWithRelationInput
    barbeiros?: BarbeiroOrderByRelationAggregateInput
    agendamentos?: AgendamentoOrderByRelationAggregateInput
  }

  export type FilialWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    cnpj?: string
    idEndereco?: number
    AND?: FilialWhereInput | FilialWhereInput[]
    OR?: FilialWhereInput[]
    NOT?: FilialWhereInput | FilialWhereInput[]
    nome?: StringFilter<"Filial"> | string
    telefone?: StringNullableFilter<"Filial"> | string | null
    email?: StringNullableFilter<"Filial"> | string | null
    horarioAbertura?: StringNullableFilter<"Filial"> | string | null
    horarioFechamento?: StringNullableFilter<"Filial"> | string | null
    endereco?: XOR<EnderecoRelationFilter, EnderecoWhereInput>
    barbeiros?: BarbeiroListRelationFilter
    agendamentos?: AgendamentoListRelationFilter
  }, "id" | "cnpj" | "idEndereco">

  export type FilialOrderByWithAggregationInput = {
    id?: SortOrder
    nome?: SortOrder
    cnpj?: SortOrder
    telefone?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    horarioAbertura?: SortOrderInput | SortOrder
    horarioFechamento?: SortOrderInput | SortOrder
    idEndereco?: SortOrder
    _count?: FilialCountOrderByAggregateInput
    _avg?: FilialAvgOrderByAggregateInput
    _max?: FilialMaxOrderByAggregateInput
    _min?: FilialMinOrderByAggregateInput
    _sum?: FilialSumOrderByAggregateInput
  }

  export type FilialScalarWhereWithAggregatesInput = {
    AND?: FilialScalarWhereWithAggregatesInput | FilialScalarWhereWithAggregatesInput[]
    OR?: FilialScalarWhereWithAggregatesInput[]
    NOT?: FilialScalarWhereWithAggregatesInput | FilialScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Filial"> | number
    nome?: StringWithAggregatesFilter<"Filial"> | string
    cnpj?: StringWithAggregatesFilter<"Filial"> | string
    telefone?: StringNullableWithAggregatesFilter<"Filial"> | string | null
    email?: StringNullableWithAggregatesFilter<"Filial"> | string | null
    horarioAbertura?: StringNullableWithAggregatesFilter<"Filial"> | string | null
    horarioFechamento?: StringNullableWithAggregatesFilter<"Filial"> | string | null
    idEndereco?: IntWithAggregatesFilter<"Filial"> | number
  }

  export type EnderecoWhereInput = {
    AND?: EnderecoWhereInput | EnderecoWhereInput[]
    OR?: EnderecoWhereInput[]
    NOT?: EnderecoWhereInput | EnderecoWhereInput[]
    id?: IntFilter<"Endereco"> | number
    cep?: StringFilter<"Endereco"> | string
    logradouro?: StringFilter<"Endereco"> | string
    numero?: StringFilter<"Endereco"> | string
    bairro?: StringFilter<"Endereco"> | string
    cidade?: StringFilter<"Endereco"> | string
    estado?: StringFilter<"Endereco"> | string
    filial?: XOR<FilialNullableRelationFilter, FilialWhereInput> | null
  }

  export type EnderecoOrderByWithRelationInput = {
    id?: SortOrder
    cep?: SortOrder
    logradouro?: SortOrder
    numero?: SortOrder
    bairro?: SortOrder
    cidade?: SortOrder
    estado?: SortOrder
    filial?: FilialOrderByWithRelationInput
  }

  export type EnderecoWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: EnderecoWhereInput | EnderecoWhereInput[]
    OR?: EnderecoWhereInput[]
    NOT?: EnderecoWhereInput | EnderecoWhereInput[]
    cep?: StringFilter<"Endereco"> | string
    logradouro?: StringFilter<"Endereco"> | string
    numero?: StringFilter<"Endereco"> | string
    bairro?: StringFilter<"Endereco"> | string
    cidade?: StringFilter<"Endereco"> | string
    estado?: StringFilter<"Endereco"> | string
    filial?: XOR<FilialNullableRelationFilter, FilialWhereInput> | null
  }, "id">

  export type EnderecoOrderByWithAggregationInput = {
    id?: SortOrder
    cep?: SortOrder
    logradouro?: SortOrder
    numero?: SortOrder
    bairro?: SortOrder
    cidade?: SortOrder
    estado?: SortOrder
    _count?: EnderecoCountOrderByAggregateInput
    _avg?: EnderecoAvgOrderByAggregateInput
    _max?: EnderecoMaxOrderByAggregateInput
    _min?: EnderecoMinOrderByAggregateInput
    _sum?: EnderecoSumOrderByAggregateInput
  }

  export type EnderecoScalarWhereWithAggregatesInput = {
    AND?: EnderecoScalarWhereWithAggregatesInput | EnderecoScalarWhereWithAggregatesInput[]
    OR?: EnderecoScalarWhereWithAggregatesInput[]
    NOT?: EnderecoScalarWhereWithAggregatesInput | EnderecoScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Endereco"> | number
    cep?: StringWithAggregatesFilter<"Endereco"> | string
    logradouro?: StringWithAggregatesFilter<"Endereco"> | string
    numero?: StringWithAggregatesFilter<"Endereco"> | string
    bairro?: StringWithAggregatesFilter<"Endereco"> | string
    cidade?: StringWithAggregatesFilter<"Endereco"> | string
    estado?: StringWithAggregatesFilter<"Endereco"> | string
  }

  export type ServicoWhereInput = {
    AND?: ServicoWhereInput | ServicoWhereInput[]
    OR?: ServicoWhereInput[]
    NOT?: ServicoWhereInput | ServicoWhereInput[]
    id?: IntFilter<"Servico"> | number
    nome?: StringFilter<"Servico"> | string
    descricao?: StringNullableFilter<"Servico"> | string | null
    preco?: DecimalFilter<"Servico"> | Decimal | DecimalJsLike | number | string
    duracaoMinutos?: IntFilter<"Servico"> | number
    agendamentos?: AgendamentoServicoListRelationFilter
  }

  export type ServicoOrderByWithRelationInput = {
    id?: SortOrder
    nome?: SortOrder
    descricao?: SortOrderInput | SortOrder
    preco?: SortOrder
    duracaoMinutos?: SortOrder
    agendamentos?: AgendamentoServicoOrderByRelationAggregateInput
  }

  export type ServicoWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: ServicoWhereInput | ServicoWhereInput[]
    OR?: ServicoWhereInput[]
    NOT?: ServicoWhereInput | ServicoWhereInput[]
    nome?: StringFilter<"Servico"> | string
    descricao?: StringNullableFilter<"Servico"> | string | null
    preco?: DecimalFilter<"Servico"> | Decimal | DecimalJsLike | number | string
    duracaoMinutos?: IntFilter<"Servico"> | number
    agendamentos?: AgendamentoServicoListRelationFilter
  }, "id">

  export type ServicoOrderByWithAggregationInput = {
    id?: SortOrder
    nome?: SortOrder
    descricao?: SortOrderInput | SortOrder
    preco?: SortOrder
    duracaoMinutos?: SortOrder
    _count?: ServicoCountOrderByAggregateInput
    _avg?: ServicoAvgOrderByAggregateInput
    _max?: ServicoMaxOrderByAggregateInput
    _min?: ServicoMinOrderByAggregateInput
    _sum?: ServicoSumOrderByAggregateInput
  }

  export type ServicoScalarWhereWithAggregatesInput = {
    AND?: ServicoScalarWhereWithAggregatesInput | ServicoScalarWhereWithAggregatesInput[]
    OR?: ServicoScalarWhereWithAggregatesInput[]
    NOT?: ServicoScalarWhereWithAggregatesInput | ServicoScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Servico"> | number
    nome?: StringWithAggregatesFilter<"Servico"> | string
    descricao?: StringNullableWithAggregatesFilter<"Servico"> | string | null
    preco?: DecimalWithAggregatesFilter<"Servico"> | Decimal | DecimalJsLike | number | string
    duracaoMinutos?: IntWithAggregatesFilter<"Servico"> | number
  }

  export type AgendamentoWhereInput = {
    AND?: AgendamentoWhereInput | AgendamentoWhereInput[]
    OR?: AgendamentoWhereInput[]
    NOT?: AgendamentoWhereInput | AgendamentoWhereInput[]
    id?: IntFilter<"Agendamento"> | number
    idCliente?: IntFilter<"Agendamento"> | number
    idBarbeiro?: IntFilter<"Agendamento"> | number
    idFilial?: IntFilter<"Agendamento"> | number
    inicio?: DateTimeFilter<"Agendamento"> | Date | string
    fim?: DateTimeFilter<"Agendamento"> | Date | string
    status?: EnumStatusAgendamentoFilter<"Agendamento"> | $Enums.StatusAgendamento
    observacao?: StringNullableFilter<"Agendamento"> | string | null
    valorTotal?: DecimalFilter<"Agendamento"> | Decimal | DecimalJsLike | number | string
    dataCriacao?: DateTimeFilter<"Agendamento"> | Date | string
    cliente?: XOR<ClienteRelationFilter, ClienteWhereInput>
    barbeiro?: XOR<BarbeiroRelationFilter, BarbeiroWhereInput>
    filial?: XOR<FilialRelationFilter, FilialWhereInput>
    servicos?: AgendamentoServicoListRelationFilter
  }

  export type AgendamentoOrderByWithRelationInput = {
    id?: SortOrder
    idCliente?: SortOrder
    idBarbeiro?: SortOrder
    idFilial?: SortOrder
    inicio?: SortOrder
    fim?: SortOrder
    status?: SortOrder
    observacao?: SortOrderInput | SortOrder
    valorTotal?: SortOrder
    dataCriacao?: SortOrder
    cliente?: ClienteOrderByWithRelationInput
    barbeiro?: BarbeiroOrderByWithRelationInput
    filial?: FilialOrderByWithRelationInput
    servicos?: AgendamentoServicoOrderByRelationAggregateInput
  }

  export type AgendamentoWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: AgendamentoWhereInput | AgendamentoWhereInput[]
    OR?: AgendamentoWhereInput[]
    NOT?: AgendamentoWhereInput | AgendamentoWhereInput[]
    idCliente?: IntFilter<"Agendamento"> | number
    idBarbeiro?: IntFilter<"Agendamento"> | number
    idFilial?: IntFilter<"Agendamento"> | number
    inicio?: DateTimeFilter<"Agendamento"> | Date | string
    fim?: DateTimeFilter<"Agendamento"> | Date | string
    status?: EnumStatusAgendamentoFilter<"Agendamento"> | $Enums.StatusAgendamento
    observacao?: StringNullableFilter<"Agendamento"> | string | null
    valorTotal?: DecimalFilter<"Agendamento"> | Decimal | DecimalJsLike | number | string
    dataCriacao?: DateTimeFilter<"Agendamento"> | Date | string
    cliente?: XOR<ClienteRelationFilter, ClienteWhereInput>
    barbeiro?: XOR<BarbeiroRelationFilter, BarbeiroWhereInput>
    filial?: XOR<FilialRelationFilter, FilialWhereInput>
    servicos?: AgendamentoServicoListRelationFilter
  }, "id">

  export type AgendamentoOrderByWithAggregationInput = {
    id?: SortOrder
    idCliente?: SortOrder
    idBarbeiro?: SortOrder
    idFilial?: SortOrder
    inicio?: SortOrder
    fim?: SortOrder
    status?: SortOrder
    observacao?: SortOrderInput | SortOrder
    valorTotal?: SortOrder
    dataCriacao?: SortOrder
    _count?: AgendamentoCountOrderByAggregateInput
    _avg?: AgendamentoAvgOrderByAggregateInput
    _max?: AgendamentoMaxOrderByAggregateInput
    _min?: AgendamentoMinOrderByAggregateInput
    _sum?: AgendamentoSumOrderByAggregateInput
  }

  export type AgendamentoScalarWhereWithAggregatesInput = {
    AND?: AgendamentoScalarWhereWithAggregatesInput | AgendamentoScalarWhereWithAggregatesInput[]
    OR?: AgendamentoScalarWhereWithAggregatesInput[]
    NOT?: AgendamentoScalarWhereWithAggregatesInput | AgendamentoScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Agendamento"> | number
    idCliente?: IntWithAggregatesFilter<"Agendamento"> | number
    idBarbeiro?: IntWithAggregatesFilter<"Agendamento"> | number
    idFilial?: IntWithAggregatesFilter<"Agendamento"> | number
    inicio?: DateTimeWithAggregatesFilter<"Agendamento"> | Date | string
    fim?: DateTimeWithAggregatesFilter<"Agendamento"> | Date | string
    status?: EnumStatusAgendamentoWithAggregatesFilter<"Agendamento"> | $Enums.StatusAgendamento
    observacao?: StringNullableWithAggregatesFilter<"Agendamento"> | string | null
    valorTotal?: DecimalWithAggregatesFilter<"Agendamento"> | Decimal | DecimalJsLike | number | string
    dataCriacao?: DateTimeWithAggregatesFilter<"Agendamento"> | Date | string
  }

  export type AgendamentoServicoWhereInput = {
    AND?: AgendamentoServicoWhereInput | AgendamentoServicoWhereInput[]
    OR?: AgendamentoServicoWhereInput[]
    NOT?: AgendamentoServicoWhereInput | AgendamentoServicoWhereInput[]
    id?: IntFilter<"AgendamentoServico"> | number
    idAgendamento?: IntFilter<"AgendamentoServico"> | number
    idServico?: IntFilter<"AgendamentoServico"> | number
    preco?: DecimalFilter<"AgendamentoServico"> | Decimal | DecimalJsLike | number | string
    duracaoMinutos?: IntFilter<"AgendamentoServico"> | number
    agendamento?: XOR<AgendamentoRelationFilter, AgendamentoWhereInput>
    servico?: XOR<ServicoRelationFilter, ServicoWhereInput>
  }

  export type AgendamentoServicoOrderByWithRelationInput = {
    id?: SortOrder
    idAgendamento?: SortOrder
    idServico?: SortOrder
    preco?: SortOrder
    duracaoMinutos?: SortOrder
    agendamento?: AgendamentoOrderByWithRelationInput
    servico?: ServicoOrderByWithRelationInput
  }

  export type AgendamentoServicoWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    idAgendamento_idServico?: AgendamentoServicoIdAgendamentoIdServicoCompoundUniqueInput
    AND?: AgendamentoServicoWhereInput | AgendamentoServicoWhereInput[]
    OR?: AgendamentoServicoWhereInput[]
    NOT?: AgendamentoServicoWhereInput | AgendamentoServicoWhereInput[]
    idAgendamento?: IntFilter<"AgendamentoServico"> | number
    idServico?: IntFilter<"AgendamentoServico"> | number
    preco?: DecimalFilter<"AgendamentoServico"> | Decimal | DecimalJsLike | number | string
    duracaoMinutos?: IntFilter<"AgendamentoServico"> | number
    agendamento?: XOR<AgendamentoRelationFilter, AgendamentoWhereInput>
    servico?: XOR<ServicoRelationFilter, ServicoWhereInput>
  }, "id" | "idAgendamento_idServico">

  export type AgendamentoServicoOrderByWithAggregationInput = {
    id?: SortOrder
    idAgendamento?: SortOrder
    idServico?: SortOrder
    preco?: SortOrder
    duracaoMinutos?: SortOrder
    _count?: AgendamentoServicoCountOrderByAggregateInput
    _avg?: AgendamentoServicoAvgOrderByAggregateInput
    _max?: AgendamentoServicoMaxOrderByAggregateInput
    _min?: AgendamentoServicoMinOrderByAggregateInput
    _sum?: AgendamentoServicoSumOrderByAggregateInput
  }

  export type AgendamentoServicoScalarWhereWithAggregatesInput = {
    AND?: AgendamentoServicoScalarWhereWithAggregatesInput | AgendamentoServicoScalarWhereWithAggregatesInput[]
    OR?: AgendamentoServicoScalarWhereWithAggregatesInput[]
    NOT?: AgendamentoServicoScalarWhereWithAggregatesInput | AgendamentoServicoScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"AgendamentoServico"> | number
    idAgendamento?: IntWithAggregatesFilter<"AgendamentoServico"> | number
    idServico?: IntWithAggregatesFilter<"AgendamentoServico"> | number
    preco?: DecimalWithAggregatesFilter<"AgendamentoServico"> | Decimal | DecimalJsLike | number | string
    duracaoMinutos?: IntWithAggregatesFilter<"AgendamentoServico"> | number
  }

  export type UsuarioCreateInput = {
    nome: string
    email: string
    senha: string
    dataCadastro?: Date | string
    tipoPerfil: $Enums.TipoPerfil
    createdAt?: Date | string
    updatedAt?: Date | string
    cliente?: ClienteCreateNestedOneWithoutUsuarioInput
    barbeiro?: BarbeiroCreateNestedOneWithoutUsuarioInput
  }

  export type UsuarioUncheckedCreateInput = {
    id?: number
    nome: string
    email: string
    senha: string
    dataCadastro?: Date | string
    tipoPerfil: $Enums.TipoPerfil
    createdAt?: Date | string
    updatedAt?: Date | string
    cliente?: ClienteUncheckedCreateNestedOneWithoutUsuarioInput
    barbeiro?: BarbeiroUncheckedCreateNestedOneWithoutUsuarioInput
  }

  export type UsuarioUpdateInput = {
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    senha?: StringFieldUpdateOperationsInput | string
    dataCadastro?: DateTimeFieldUpdateOperationsInput | Date | string
    tipoPerfil?: EnumTipoPerfilFieldUpdateOperationsInput | $Enums.TipoPerfil
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cliente?: ClienteUpdateOneWithoutUsuarioNestedInput
    barbeiro?: BarbeiroUpdateOneWithoutUsuarioNestedInput
  }

  export type UsuarioUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    senha?: StringFieldUpdateOperationsInput | string
    dataCadastro?: DateTimeFieldUpdateOperationsInput | Date | string
    tipoPerfil?: EnumTipoPerfilFieldUpdateOperationsInput | $Enums.TipoPerfil
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cliente?: ClienteUncheckedUpdateOneWithoutUsuarioNestedInput
    barbeiro?: BarbeiroUncheckedUpdateOneWithoutUsuarioNestedInput
  }

  export type UsuarioCreateManyInput = {
    id?: number
    nome: string
    email: string
    senha: string
    dataCadastro?: Date | string
    tipoPerfil: $Enums.TipoPerfil
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UsuarioUpdateManyMutationInput = {
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    senha?: StringFieldUpdateOperationsInput | string
    dataCadastro?: DateTimeFieldUpdateOperationsInput | Date | string
    tipoPerfil?: EnumTipoPerfilFieldUpdateOperationsInput | $Enums.TipoPerfil
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UsuarioUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    senha?: StringFieldUpdateOperationsInput | string
    dataCadastro?: DateTimeFieldUpdateOperationsInput | Date | string
    tipoPerfil?: EnumTipoPerfilFieldUpdateOperationsInput | $Enums.TipoPerfil
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClienteCreateInput = {
    cpf: string
    dataNascimento?: Date | string | null
    usuario: UsuarioCreateNestedOneWithoutClienteInput
    agendamentos?: AgendamentoCreateNestedManyWithoutClienteInput
  }

  export type ClienteUncheckedCreateInput = {
    id: number
    cpf: string
    dataNascimento?: Date | string | null
    agendamentos?: AgendamentoUncheckedCreateNestedManyWithoutClienteInput
  }

  export type ClienteUpdateInput = {
    cpf?: StringFieldUpdateOperationsInput | string
    dataNascimento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    usuario?: UsuarioUpdateOneRequiredWithoutClienteNestedInput
    agendamentos?: AgendamentoUpdateManyWithoutClienteNestedInput
  }

  export type ClienteUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    cpf?: StringFieldUpdateOperationsInput | string
    dataNascimento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    agendamentos?: AgendamentoUncheckedUpdateManyWithoutClienteNestedInput
  }

  export type ClienteCreateManyInput = {
    id: number
    cpf: string
    dataNascimento?: Date | string | null
  }

  export type ClienteUpdateManyMutationInput = {
    cpf?: StringFieldUpdateOperationsInput | string
    dataNascimento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ClienteUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    cpf?: StringFieldUpdateOperationsInput | string
    dataNascimento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type BarbeiroCreateInput = {
    descricao?: string | null
    dataAdmissao?: Date | string | null
    status?: $Enums.StatusBarbeiro
    filial: FilialCreateNestedOneWithoutBarbeirosInput
    usuario: UsuarioCreateNestedOneWithoutBarbeiroInput
    agendamentos?: AgendamentoCreateNestedManyWithoutBarbeiroInput
  }

  export type BarbeiroUncheckedCreateInput = {
    id: number
    descricao?: string | null
    dataAdmissao?: Date | string | null
    status?: $Enums.StatusBarbeiro
    idFilial: number
    agendamentos?: AgendamentoUncheckedCreateNestedManyWithoutBarbeiroInput
  }

  export type BarbeiroUpdateInput = {
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    dataAdmissao?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumStatusBarbeiroFieldUpdateOperationsInput | $Enums.StatusBarbeiro
    filial?: FilialUpdateOneRequiredWithoutBarbeirosNestedInput
    usuario?: UsuarioUpdateOneRequiredWithoutBarbeiroNestedInput
    agendamentos?: AgendamentoUpdateManyWithoutBarbeiroNestedInput
  }

  export type BarbeiroUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    dataAdmissao?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumStatusBarbeiroFieldUpdateOperationsInput | $Enums.StatusBarbeiro
    idFilial?: IntFieldUpdateOperationsInput | number
    agendamentos?: AgendamentoUncheckedUpdateManyWithoutBarbeiroNestedInput
  }

  export type BarbeiroCreateManyInput = {
    id: number
    descricao?: string | null
    dataAdmissao?: Date | string | null
    status?: $Enums.StatusBarbeiro
    idFilial: number
  }

  export type BarbeiroUpdateManyMutationInput = {
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    dataAdmissao?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumStatusBarbeiroFieldUpdateOperationsInput | $Enums.StatusBarbeiro
  }

  export type BarbeiroUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    dataAdmissao?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumStatusBarbeiroFieldUpdateOperationsInput | $Enums.StatusBarbeiro
    idFilial?: IntFieldUpdateOperationsInput | number
  }

  export type FilialCreateInput = {
    nome: string
    cnpj: string
    telefone?: string | null
    email?: string | null
    horarioAbertura?: string | null
    horarioFechamento?: string | null
    endereco: EnderecoCreateNestedOneWithoutFilialInput
    barbeiros?: BarbeiroCreateNestedManyWithoutFilialInput
    agendamentos?: AgendamentoCreateNestedManyWithoutFilialInput
  }

  export type FilialUncheckedCreateInput = {
    id?: number
    nome: string
    cnpj: string
    telefone?: string | null
    email?: string | null
    horarioAbertura?: string | null
    horarioFechamento?: string | null
    idEndereco: number
    barbeiros?: BarbeiroUncheckedCreateNestedManyWithoutFilialInput
    agendamentos?: AgendamentoUncheckedCreateNestedManyWithoutFilialInput
  }

  export type FilialUpdateInput = {
    nome?: StringFieldUpdateOperationsInput | string
    cnpj?: StringFieldUpdateOperationsInput | string
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    horarioAbertura?: NullableStringFieldUpdateOperationsInput | string | null
    horarioFechamento?: NullableStringFieldUpdateOperationsInput | string | null
    endereco?: EnderecoUpdateOneRequiredWithoutFilialNestedInput
    barbeiros?: BarbeiroUpdateManyWithoutFilialNestedInput
    agendamentos?: AgendamentoUpdateManyWithoutFilialNestedInput
  }

  export type FilialUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    nome?: StringFieldUpdateOperationsInput | string
    cnpj?: StringFieldUpdateOperationsInput | string
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    horarioAbertura?: NullableStringFieldUpdateOperationsInput | string | null
    horarioFechamento?: NullableStringFieldUpdateOperationsInput | string | null
    idEndereco?: IntFieldUpdateOperationsInput | number
    barbeiros?: BarbeiroUncheckedUpdateManyWithoutFilialNestedInput
    agendamentos?: AgendamentoUncheckedUpdateManyWithoutFilialNestedInput
  }

  export type FilialCreateManyInput = {
    id?: number
    nome: string
    cnpj: string
    telefone?: string | null
    email?: string | null
    horarioAbertura?: string | null
    horarioFechamento?: string | null
    idEndereco: number
  }

  export type FilialUpdateManyMutationInput = {
    nome?: StringFieldUpdateOperationsInput | string
    cnpj?: StringFieldUpdateOperationsInput | string
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    horarioAbertura?: NullableStringFieldUpdateOperationsInput | string | null
    horarioFechamento?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type FilialUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    nome?: StringFieldUpdateOperationsInput | string
    cnpj?: StringFieldUpdateOperationsInput | string
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    horarioAbertura?: NullableStringFieldUpdateOperationsInput | string | null
    horarioFechamento?: NullableStringFieldUpdateOperationsInput | string | null
    idEndereco?: IntFieldUpdateOperationsInput | number
  }

  export type EnderecoCreateInput = {
    cep: string
    logradouro: string
    numero: string
    bairro: string
    cidade: string
    estado: string
    filial?: FilialCreateNestedOneWithoutEnderecoInput
  }

  export type EnderecoUncheckedCreateInput = {
    id?: number
    cep: string
    logradouro: string
    numero: string
    bairro: string
    cidade: string
    estado: string
    filial?: FilialUncheckedCreateNestedOneWithoutEnderecoInput
  }

  export type EnderecoUpdateInput = {
    cep?: StringFieldUpdateOperationsInput | string
    logradouro?: StringFieldUpdateOperationsInput | string
    numero?: StringFieldUpdateOperationsInput | string
    bairro?: StringFieldUpdateOperationsInput | string
    cidade?: StringFieldUpdateOperationsInput | string
    estado?: StringFieldUpdateOperationsInput | string
    filial?: FilialUpdateOneWithoutEnderecoNestedInput
  }

  export type EnderecoUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    cep?: StringFieldUpdateOperationsInput | string
    logradouro?: StringFieldUpdateOperationsInput | string
    numero?: StringFieldUpdateOperationsInput | string
    bairro?: StringFieldUpdateOperationsInput | string
    cidade?: StringFieldUpdateOperationsInput | string
    estado?: StringFieldUpdateOperationsInput | string
    filial?: FilialUncheckedUpdateOneWithoutEnderecoNestedInput
  }

  export type EnderecoCreateManyInput = {
    id?: number
    cep: string
    logradouro: string
    numero: string
    bairro: string
    cidade: string
    estado: string
  }

  export type EnderecoUpdateManyMutationInput = {
    cep?: StringFieldUpdateOperationsInput | string
    logradouro?: StringFieldUpdateOperationsInput | string
    numero?: StringFieldUpdateOperationsInput | string
    bairro?: StringFieldUpdateOperationsInput | string
    cidade?: StringFieldUpdateOperationsInput | string
    estado?: StringFieldUpdateOperationsInput | string
  }

  export type EnderecoUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    cep?: StringFieldUpdateOperationsInput | string
    logradouro?: StringFieldUpdateOperationsInput | string
    numero?: StringFieldUpdateOperationsInput | string
    bairro?: StringFieldUpdateOperationsInput | string
    cidade?: StringFieldUpdateOperationsInput | string
    estado?: StringFieldUpdateOperationsInput | string
  }

  export type ServicoCreateInput = {
    nome: string
    descricao?: string | null
    preco: Decimal | DecimalJsLike | number | string
    duracaoMinutos: number
    agendamentos?: AgendamentoServicoCreateNestedManyWithoutServicoInput
  }

  export type ServicoUncheckedCreateInput = {
    id?: number
    nome: string
    descricao?: string | null
    preco: Decimal | DecimalJsLike | number | string
    duracaoMinutos: number
    agendamentos?: AgendamentoServicoUncheckedCreateNestedManyWithoutServicoInput
  }

  export type ServicoUpdateInput = {
    nome?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    preco?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    duracaoMinutos?: IntFieldUpdateOperationsInput | number
    agendamentos?: AgendamentoServicoUpdateManyWithoutServicoNestedInput
  }

  export type ServicoUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    nome?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    preco?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    duracaoMinutos?: IntFieldUpdateOperationsInput | number
    agendamentos?: AgendamentoServicoUncheckedUpdateManyWithoutServicoNestedInput
  }

  export type ServicoCreateManyInput = {
    id?: number
    nome: string
    descricao?: string | null
    preco: Decimal | DecimalJsLike | number | string
    duracaoMinutos: number
  }

  export type ServicoUpdateManyMutationInput = {
    nome?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    preco?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    duracaoMinutos?: IntFieldUpdateOperationsInput | number
  }

  export type ServicoUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    nome?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    preco?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    duracaoMinutos?: IntFieldUpdateOperationsInput | number
  }

  export type AgendamentoCreateInput = {
    inicio: Date | string
    fim: Date | string
    status?: $Enums.StatusAgendamento
    observacao?: string | null
    valorTotal: Decimal | DecimalJsLike | number | string
    dataCriacao?: Date | string
    cliente: ClienteCreateNestedOneWithoutAgendamentosInput
    barbeiro: BarbeiroCreateNestedOneWithoutAgendamentosInput
    filial: FilialCreateNestedOneWithoutAgendamentosInput
    servicos?: AgendamentoServicoCreateNestedManyWithoutAgendamentoInput
  }

  export type AgendamentoUncheckedCreateInput = {
    id?: number
    idCliente: number
    idBarbeiro: number
    idFilial: number
    inicio: Date | string
    fim: Date | string
    status?: $Enums.StatusAgendamento
    observacao?: string | null
    valorTotal: Decimal | DecimalJsLike | number | string
    dataCriacao?: Date | string
    servicos?: AgendamentoServicoUncheckedCreateNestedManyWithoutAgendamentoInput
  }

  export type AgendamentoUpdateInput = {
    inicio?: DateTimeFieldUpdateOperationsInput | Date | string
    fim?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumStatusAgendamentoFieldUpdateOperationsInput | $Enums.StatusAgendamento
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    valorTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    dataCriacao?: DateTimeFieldUpdateOperationsInput | Date | string
    cliente?: ClienteUpdateOneRequiredWithoutAgendamentosNestedInput
    barbeiro?: BarbeiroUpdateOneRequiredWithoutAgendamentosNestedInput
    filial?: FilialUpdateOneRequiredWithoutAgendamentosNestedInput
    servicos?: AgendamentoServicoUpdateManyWithoutAgendamentoNestedInput
  }

  export type AgendamentoUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    idCliente?: IntFieldUpdateOperationsInput | number
    idBarbeiro?: IntFieldUpdateOperationsInput | number
    idFilial?: IntFieldUpdateOperationsInput | number
    inicio?: DateTimeFieldUpdateOperationsInput | Date | string
    fim?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumStatusAgendamentoFieldUpdateOperationsInput | $Enums.StatusAgendamento
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    valorTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    dataCriacao?: DateTimeFieldUpdateOperationsInput | Date | string
    servicos?: AgendamentoServicoUncheckedUpdateManyWithoutAgendamentoNestedInput
  }

  export type AgendamentoCreateManyInput = {
    id?: number
    idCliente: number
    idBarbeiro: number
    idFilial: number
    inicio: Date | string
    fim: Date | string
    status?: $Enums.StatusAgendamento
    observacao?: string | null
    valorTotal: Decimal | DecimalJsLike | number | string
    dataCriacao?: Date | string
  }

  export type AgendamentoUpdateManyMutationInput = {
    inicio?: DateTimeFieldUpdateOperationsInput | Date | string
    fim?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumStatusAgendamentoFieldUpdateOperationsInput | $Enums.StatusAgendamento
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    valorTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    dataCriacao?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgendamentoUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    idCliente?: IntFieldUpdateOperationsInput | number
    idBarbeiro?: IntFieldUpdateOperationsInput | number
    idFilial?: IntFieldUpdateOperationsInput | number
    inicio?: DateTimeFieldUpdateOperationsInput | Date | string
    fim?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumStatusAgendamentoFieldUpdateOperationsInput | $Enums.StatusAgendamento
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    valorTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    dataCriacao?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgendamentoServicoCreateInput = {
    preco: Decimal | DecimalJsLike | number | string
    duracaoMinutos: number
    agendamento: AgendamentoCreateNestedOneWithoutServicosInput
    servico: ServicoCreateNestedOneWithoutAgendamentosInput
  }

  export type AgendamentoServicoUncheckedCreateInput = {
    id?: number
    idAgendamento: number
    idServico: number
    preco: Decimal | DecimalJsLike | number | string
    duracaoMinutos: number
  }

  export type AgendamentoServicoUpdateInput = {
    preco?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    duracaoMinutos?: IntFieldUpdateOperationsInput | number
    agendamento?: AgendamentoUpdateOneRequiredWithoutServicosNestedInput
    servico?: ServicoUpdateOneRequiredWithoutAgendamentosNestedInput
  }

  export type AgendamentoServicoUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    idAgendamento?: IntFieldUpdateOperationsInput | number
    idServico?: IntFieldUpdateOperationsInput | number
    preco?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    duracaoMinutos?: IntFieldUpdateOperationsInput | number
  }

  export type AgendamentoServicoCreateManyInput = {
    id?: number
    idAgendamento: number
    idServico: number
    preco: Decimal | DecimalJsLike | number | string
    duracaoMinutos: number
  }

  export type AgendamentoServicoUpdateManyMutationInput = {
    preco?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    duracaoMinutos?: IntFieldUpdateOperationsInput | number
  }

  export type AgendamentoServicoUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    idAgendamento?: IntFieldUpdateOperationsInput | number
    idServico?: IntFieldUpdateOperationsInput | number
    preco?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    duracaoMinutos?: IntFieldUpdateOperationsInput | number
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type EnumTipoPerfilFilter<$PrismaModel = never> = {
    equals?: $Enums.TipoPerfil | EnumTipoPerfilFieldRefInput<$PrismaModel>
    in?: $Enums.TipoPerfil[] | ListEnumTipoPerfilFieldRefInput<$PrismaModel>
    notIn?: $Enums.TipoPerfil[] | ListEnumTipoPerfilFieldRefInput<$PrismaModel>
    not?: NestedEnumTipoPerfilFilter<$PrismaModel> | $Enums.TipoPerfil
  }

  export type ClienteNullableRelationFilter = {
    is?: ClienteWhereInput | null
    isNot?: ClienteWhereInput | null
  }

  export type BarbeiroNullableRelationFilter = {
    is?: BarbeiroWhereInput | null
    isNot?: BarbeiroWhereInput | null
  }

  export type UsuarioCountOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    email?: SortOrder
    senha?: SortOrder
    dataCadastro?: SortOrder
    tipoPerfil?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UsuarioAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type UsuarioMaxOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    email?: SortOrder
    senha?: SortOrder
    dataCadastro?: SortOrder
    tipoPerfil?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UsuarioMinOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    email?: SortOrder
    senha?: SortOrder
    dataCadastro?: SortOrder
    tipoPerfil?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UsuarioSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EnumTipoPerfilWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TipoPerfil | EnumTipoPerfilFieldRefInput<$PrismaModel>
    in?: $Enums.TipoPerfil[] | ListEnumTipoPerfilFieldRefInput<$PrismaModel>
    notIn?: $Enums.TipoPerfil[] | ListEnumTipoPerfilFieldRefInput<$PrismaModel>
    not?: NestedEnumTipoPerfilWithAggregatesFilter<$PrismaModel> | $Enums.TipoPerfil
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTipoPerfilFilter<$PrismaModel>
    _max?: NestedEnumTipoPerfilFilter<$PrismaModel>
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type UsuarioRelationFilter = {
    is?: UsuarioWhereInput
    isNot?: UsuarioWhereInput
  }

  export type AgendamentoListRelationFilter = {
    every?: AgendamentoWhereInput
    some?: AgendamentoWhereInput
    none?: AgendamentoWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type AgendamentoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ClienteCountOrderByAggregateInput = {
    id?: SortOrder
    cpf?: SortOrder
    dataNascimento?: SortOrder
  }

  export type ClienteAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type ClienteMaxOrderByAggregateInput = {
    id?: SortOrder
    cpf?: SortOrder
    dataNascimento?: SortOrder
  }

  export type ClienteMinOrderByAggregateInput = {
    id?: SortOrder
    cpf?: SortOrder
    dataNascimento?: SortOrder
  }

  export type ClienteSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type EnumStatusBarbeiroFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusBarbeiro | EnumStatusBarbeiroFieldRefInput<$PrismaModel>
    in?: $Enums.StatusBarbeiro[] | ListEnumStatusBarbeiroFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusBarbeiro[] | ListEnumStatusBarbeiroFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusBarbeiroFilter<$PrismaModel> | $Enums.StatusBarbeiro
  }

  export type FilialRelationFilter = {
    is?: FilialWhereInput
    isNot?: FilialWhereInput
  }

  export type BarbeiroCountOrderByAggregateInput = {
    id?: SortOrder
    descricao?: SortOrder
    dataAdmissao?: SortOrder
    status?: SortOrder
    idFilial?: SortOrder
  }

  export type BarbeiroAvgOrderByAggregateInput = {
    id?: SortOrder
    idFilial?: SortOrder
  }

  export type BarbeiroMaxOrderByAggregateInput = {
    id?: SortOrder
    descricao?: SortOrder
    dataAdmissao?: SortOrder
    status?: SortOrder
    idFilial?: SortOrder
  }

  export type BarbeiroMinOrderByAggregateInput = {
    id?: SortOrder
    descricao?: SortOrder
    dataAdmissao?: SortOrder
    status?: SortOrder
    idFilial?: SortOrder
  }

  export type BarbeiroSumOrderByAggregateInput = {
    id?: SortOrder
    idFilial?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumStatusBarbeiroWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusBarbeiro | EnumStatusBarbeiroFieldRefInput<$PrismaModel>
    in?: $Enums.StatusBarbeiro[] | ListEnumStatusBarbeiroFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusBarbeiro[] | ListEnumStatusBarbeiroFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusBarbeiroWithAggregatesFilter<$PrismaModel> | $Enums.StatusBarbeiro
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStatusBarbeiroFilter<$PrismaModel>
    _max?: NestedEnumStatusBarbeiroFilter<$PrismaModel>
  }

  export type EnderecoRelationFilter = {
    is?: EnderecoWhereInput
    isNot?: EnderecoWhereInput
  }

  export type BarbeiroListRelationFilter = {
    every?: BarbeiroWhereInput
    some?: BarbeiroWhereInput
    none?: BarbeiroWhereInput
  }

  export type BarbeiroOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type FilialCountOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    cnpj?: SortOrder
    telefone?: SortOrder
    email?: SortOrder
    horarioAbertura?: SortOrder
    horarioFechamento?: SortOrder
    idEndereco?: SortOrder
  }

  export type FilialAvgOrderByAggregateInput = {
    id?: SortOrder
    idEndereco?: SortOrder
  }

  export type FilialMaxOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    cnpj?: SortOrder
    telefone?: SortOrder
    email?: SortOrder
    horarioAbertura?: SortOrder
    horarioFechamento?: SortOrder
    idEndereco?: SortOrder
  }

  export type FilialMinOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    cnpj?: SortOrder
    telefone?: SortOrder
    email?: SortOrder
    horarioAbertura?: SortOrder
    horarioFechamento?: SortOrder
    idEndereco?: SortOrder
  }

  export type FilialSumOrderByAggregateInput = {
    id?: SortOrder
    idEndereco?: SortOrder
  }

  export type FilialNullableRelationFilter = {
    is?: FilialWhereInput | null
    isNot?: FilialWhereInput | null
  }

  export type EnderecoCountOrderByAggregateInput = {
    id?: SortOrder
    cep?: SortOrder
    logradouro?: SortOrder
    numero?: SortOrder
    bairro?: SortOrder
    cidade?: SortOrder
    estado?: SortOrder
  }

  export type EnderecoAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type EnderecoMaxOrderByAggregateInput = {
    id?: SortOrder
    cep?: SortOrder
    logradouro?: SortOrder
    numero?: SortOrder
    bairro?: SortOrder
    cidade?: SortOrder
    estado?: SortOrder
  }

  export type EnderecoMinOrderByAggregateInput = {
    id?: SortOrder
    cep?: SortOrder
    logradouro?: SortOrder
    numero?: SortOrder
    bairro?: SortOrder
    cidade?: SortOrder
    estado?: SortOrder
  }

  export type EnderecoSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type AgendamentoServicoListRelationFilter = {
    every?: AgendamentoServicoWhereInput
    some?: AgendamentoServicoWhereInput
    none?: AgendamentoServicoWhereInput
  }

  export type AgendamentoServicoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ServicoCountOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    descricao?: SortOrder
    preco?: SortOrder
    duracaoMinutos?: SortOrder
  }

  export type ServicoAvgOrderByAggregateInput = {
    id?: SortOrder
    preco?: SortOrder
    duracaoMinutos?: SortOrder
  }

  export type ServicoMaxOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    descricao?: SortOrder
    preco?: SortOrder
    duracaoMinutos?: SortOrder
  }

  export type ServicoMinOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    descricao?: SortOrder
    preco?: SortOrder
    duracaoMinutos?: SortOrder
  }

  export type ServicoSumOrderByAggregateInput = {
    id?: SortOrder
    preco?: SortOrder
    duracaoMinutos?: SortOrder
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type EnumStatusAgendamentoFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusAgendamento | EnumStatusAgendamentoFieldRefInput<$PrismaModel>
    in?: $Enums.StatusAgendamento[] | ListEnumStatusAgendamentoFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusAgendamento[] | ListEnumStatusAgendamentoFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusAgendamentoFilter<$PrismaModel> | $Enums.StatusAgendamento
  }

  export type ClienteRelationFilter = {
    is?: ClienteWhereInput
    isNot?: ClienteWhereInput
  }

  export type BarbeiroRelationFilter = {
    is?: BarbeiroWhereInput
    isNot?: BarbeiroWhereInput
  }

  export type AgendamentoCountOrderByAggregateInput = {
    id?: SortOrder
    idCliente?: SortOrder
    idBarbeiro?: SortOrder
    idFilial?: SortOrder
    inicio?: SortOrder
    fim?: SortOrder
    status?: SortOrder
    observacao?: SortOrder
    valorTotal?: SortOrder
    dataCriacao?: SortOrder
  }

  export type AgendamentoAvgOrderByAggregateInput = {
    id?: SortOrder
    idCliente?: SortOrder
    idBarbeiro?: SortOrder
    idFilial?: SortOrder
    valorTotal?: SortOrder
  }

  export type AgendamentoMaxOrderByAggregateInput = {
    id?: SortOrder
    idCliente?: SortOrder
    idBarbeiro?: SortOrder
    idFilial?: SortOrder
    inicio?: SortOrder
    fim?: SortOrder
    status?: SortOrder
    observacao?: SortOrder
    valorTotal?: SortOrder
    dataCriacao?: SortOrder
  }

  export type AgendamentoMinOrderByAggregateInput = {
    id?: SortOrder
    idCliente?: SortOrder
    idBarbeiro?: SortOrder
    idFilial?: SortOrder
    inicio?: SortOrder
    fim?: SortOrder
    status?: SortOrder
    observacao?: SortOrder
    valorTotal?: SortOrder
    dataCriacao?: SortOrder
  }

  export type AgendamentoSumOrderByAggregateInput = {
    id?: SortOrder
    idCliente?: SortOrder
    idBarbeiro?: SortOrder
    idFilial?: SortOrder
    valorTotal?: SortOrder
  }

  export type EnumStatusAgendamentoWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusAgendamento | EnumStatusAgendamentoFieldRefInput<$PrismaModel>
    in?: $Enums.StatusAgendamento[] | ListEnumStatusAgendamentoFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusAgendamento[] | ListEnumStatusAgendamentoFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusAgendamentoWithAggregatesFilter<$PrismaModel> | $Enums.StatusAgendamento
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStatusAgendamentoFilter<$PrismaModel>
    _max?: NestedEnumStatusAgendamentoFilter<$PrismaModel>
  }

  export type AgendamentoRelationFilter = {
    is?: AgendamentoWhereInput
    isNot?: AgendamentoWhereInput
  }

  export type ServicoRelationFilter = {
    is?: ServicoWhereInput
    isNot?: ServicoWhereInput
  }

  export type AgendamentoServicoIdAgendamentoIdServicoCompoundUniqueInput = {
    idAgendamento: number
    idServico: number
  }

  export type AgendamentoServicoCountOrderByAggregateInput = {
    id?: SortOrder
    idAgendamento?: SortOrder
    idServico?: SortOrder
    preco?: SortOrder
    duracaoMinutos?: SortOrder
  }

  export type AgendamentoServicoAvgOrderByAggregateInput = {
    id?: SortOrder
    idAgendamento?: SortOrder
    idServico?: SortOrder
    preco?: SortOrder
    duracaoMinutos?: SortOrder
  }

  export type AgendamentoServicoMaxOrderByAggregateInput = {
    id?: SortOrder
    idAgendamento?: SortOrder
    idServico?: SortOrder
    preco?: SortOrder
    duracaoMinutos?: SortOrder
  }

  export type AgendamentoServicoMinOrderByAggregateInput = {
    id?: SortOrder
    idAgendamento?: SortOrder
    idServico?: SortOrder
    preco?: SortOrder
    duracaoMinutos?: SortOrder
  }

  export type AgendamentoServicoSumOrderByAggregateInput = {
    id?: SortOrder
    idAgendamento?: SortOrder
    idServico?: SortOrder
    preco?: SortOrder
    duracaoMinutos?: SortOrder
  }

  export type ClienteCreateNestedOneWithoutUsuarioInput = {
    create?: XOR<ClienteCreateWithoutUsuarioInput, ClienteUncheckedCreateWithoutUsuarioInput>
    connectOrCreate?: ClienteCreateOrConnectWithoutUsuarioInput
    connect?: ClienteWhereUniqueInput
  }

  export type BarbeiroCreateNestedOneWithoutUsuarioInput = {
    create?: XOR<BarbeiroCreateWithoutUsuarioInput, BarbeiroUncheckedCreateWithoutUsuarioInput>
    connectOrCreate?: BarbeiroCreateOrConnectWithoutUsuarioInput
    connect?: BarbeiroWhereUniqueInput
  }

  export type ClienteUncheckedCreateNestedOneWithoutUsuarioInput = {
    create?: XOR<ClienteCreateWithoutUsuarioInput, ClienteUncheckedCreateWithoutUsuarioInput>
    connectOrCreate?: ClienteCreateOrConnectWithoutUsuarioInput
    connect?: ClienteWhereUniqueInput
  }

  export type BarbeiroUncheckedCreateNestedOneWithoutUsuarioInput = {
    create?: XOR<BarbeiroCreateWithoutUsuarioInput, BarbeiroUncheckedCreateWithoutUsuarioInput>
    connectOrCreate?: BarbeiroCreateOrConnectWithoutUsuarioInput
    connect?: BarbeiroWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type EnumTipoPerfilFieldUpdateOperationsInput = {
    set?: $Enums.TipoPerfil
  }

  export type ClienteUpdateOneWithoutUsuarioNestedInput = {
    create?: XOR<ClienteCreateWithoutUsuarioInput, ClienteUncheckedCreateWithoutUsuarioInput>
    connectOrCreate?: ClienteCreateOrConnectWithoutUsuarioInput
    upsert?: ClienteUpsertWithoutUsuarioInput
    disconnect?: ClienteWhereInput | boolean
    delete?: ClienteWhereInput | boolean
    connect?: ClienteWhereUniqueInput
    update?: XOR<XOR<ClienteUpdateToOneWithWhereWithoutUsuarioInput, ClienteUpdateWithoutUsuarioInput>, ClienteUncheckedUpdateWithoutUsuarioInput>
  }

  export type BarbeiroUpdateOneWithoutUsuarioNestedInput = {
    create?: XOR<BarbeiroCreateWithoutUsuarioInput, BarbeiroUncheckedCreateWithoutUsuarioInput>
    connectOrCreate?: BarbeiroCreateOrConnectWithoutUsuarioInput
    upsert?: BarbeiroUpsertWithoutUsuarioInput
    disconnect?: BarbeiroWhereInput | boolean
    delete?: BarbeiroWhereInput | boolean
    connect?: BarbeiroWhereUniqueInput
    update?: XOR<XOR<BarbeiroUpdateToOneWithWhereWithoutUsuarioInput, BarbeiroUpdateWithoutUsuarioInput>, BarbeiroUncheckedUpdateWithoutUsuarioInput>
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ClienteUncheckedUpdateOneWithoutUsuarioNestedInput = {
    create?: XOR<ClienteCreateWithoutUsuarioInput, ClienteUncheckedCreateWithoutUsuarioInput>
    connectOrCreate?: ClienteCreateOrConnectWithoutUsuarioInput
    upsert?: ClienteUpsertWithoutUsuarioInput
    disconnect?: ClienteWhereInput | boolean
    delete?: ClienteWhereInput | boolean
    connect?: ClienteWhereUniqueInput
    update?: XOR<XOR<ClienteUpdateToOneWithWhereWithoutUsuarioInput, ClienteUpdateWithoutUsuarioInput>, ClienteUncheckedUpdateWithoutUsuarioInput>
  }

  export type BarbeiroUncheckedUpdateOneWithoutUsuarioNestedInput = {
    create?: XOR<BarbeiroCreateWithoutUsuarioInput, BarbeiroUncheckedCreateWithoutUsuarioInput>
    connectOrCreate?: BarbeiroCreateOrConnectWithoutUsuarioInput
    upsert?: BarbeiroUpsertWithoutUsuarioInput
    disconnect?: BarbeiroWhereInput | boolean
    delete?: BarbeiroWhereInput | boolean
    connect?: BarbeiroWhereUniqueInput
    update?: XOR<XOR<BarbeiroUpdateToOneWithWhereWithoutUsuarioInput, BarbeiroUpdateWithoutUsuarioInput>, BarbeiroUncheckedUpdateWithoutUsuarioInput>
  }

  export type UsuarioCreateNestedOneWithoutClienteInput = {
    create?: XOR<UsuarioCreateWithoutClienteInput, UsuarioUncheckedCreateWithoutClienteInput>
    connectOrCreate?: UsuarioCreateOrConnectWithoutClienteInput
    connect?: UsuarioWhereUniqueInput
  }

  export type AgendamentoCreateNestedManyWithoutClienteInput = {
    create?: XOR<AgendamentoCreateWithoutClienteInput, AgendamentoUncheckedCreateWithoutClienteInput> | AgendamentoCreateWithoutClienteInput[] | AgendamentoUncheckedCreateWithoutClienteInput[]
    connectOrCreate?: AgendamentoCreateOrConnectWithoutClienteInput | AgendamentoCreateOrConnectWithoutClienteInput[]
    createMany?: AgendamentoCreateManyClienteInputEnvelope
    connect?: AgendamentoWhereUniqueInput | AgendamentoWhereUniqueInput[]
  }

  export type AgendamentoUncheckedCreateNestedManyWithoutClienteInput = {
    create?: XOR<AgendamentoCreateWithoutClienteInput, AgendamentoUncheckedCreateWithoutClienteInput> | AgendamentoCreateWithoutClienteInput[] | AgendamentoUncheckedCreateWithoutClienteInput[]
    connectOrCreate?: AgendamentoCreateOrConnectWithoutClienteInput | AgendamentoCreateOrConnectWithoutClienteInput[]
    createMany?: AgendamentoCreateManyClienteInputEnvelope
    connect?: AgendamentoWhereUniqueInput | AgendamentoWhereUniqueInput[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type UsuarioUpdateOneRequiredWithoutClienteNestedInput = {
    create?: XOR<UsuarioCreateWithoutClienteInput, UsuarioUncheckedCreateWithoutClienteInput>
    connectOrCreate?: UsuarioCreateOrConnectWithoutClienteInput
    upsert?: UsuarioUpsertWithoutClienteInput
    connect?: UsuarioWhereUniqueInput
    update?: XOR<XOR<UsuarioUpdateToOneWithWhereWithoutClienteInput, UsuarioUpdateWithoutClienteInput>, UsuarioUncheckedUpdateWithoutClienteInput>
  }

  export type AgendamentoUpdateManyWithoutClienteNestedInput = {
    create?: XOR<AgendamentoCreateWithoutClienteInput, AgendamentoUncheckedCreateWithoutClienteInput> | AgendamentoCreateWithoutClienteInput[] | AgendamentoUncheckedCreateWithoutClienteInput[]
    connectOrCreate?: AgendamentoCreateOrConnectWithoutClienteInput | AgendamentoCreateOrConnectWithoutClienteInput[]
    upsert?: AgendamentoUpsertWithWhereUniqueWithoutClienteInput | AgendamentoUpsertWithWhereUniqueWithoutClienteInput[]
    createMany?: AgendamentoCreateManyClienteInputEnvelope
    set?: AgendamentoWhereUniqueInput | AgendamentoWhereUniqueInput[]
    disconnect?: AgendamentoWhereUniqueInput | AgendamentoWhereUniqueInput[]
    delete?: AgendamentoWhereUniqueInput | AgendamentoWhereUniqueInput[]
    connect?: AgendamentoWhereUniqueInput | AgendamentoWhereUniqueInput[]
    update?: AgendamentoUpdateWithWhereUniqueWithoutClienteInput | AgendamentoUpdateWithWhereUniqueWithoutClienteInput[]
    updateMany?: AgendamentoUpdateManyWithWhereWithoutClienteInput | AgendamentoUpdateManyWithWhereWithoutClienteInput[]
    deleteMany?: AgendamentoScalarWhereInput | AgendamentoScalarWhereInput[]
  }

  export type AgendamentoUncheckedUpdateManyWithoutClienteNestedInput = {
    create?: XOR<AgendamentoCreateWithoutClienteInput, AgendamentoUncheckedCreateWithoutClienteInput> | AgendamentoCreateWithoutClienteInput[] | AgendamentoUncheckedCreateWithoutClienteInput[]
    connectOrCreate?: AgendamentoCreateOrConnectWithoutClienteInput | AgendamentoCreateOrConnectWithoutClienteInput[]
    upsert?: AgendamentoUpsertWithWhereUniqueWithoutClienteInput | AgendamentoUpsertWithWhereUniqueWithoutClienteInput[]
    createMany?: AgendamentoCreateManyClienteInputEnvelope
    set?: AgendamentoWhereUniqueInput | AgendamentoWhereUniqueInput[]
    disconnect?: AgendamentoWhereUniqueInput | AgendamentoWhereUniqueInput[]
    delete?: AgendamentoWhereUniqueInput | AgendamentoWhereUniqueInput[]
    connect?: AgendamentoWhereUniqueInput | AgendamentoWhereUniqueInput[]
    update?: AgendamentoUpdateWithWhereUniqueWithoutClienteInput | AgendamentoUpdateWithWhereUniqueWithoutClienteInput[]
    updateMany?: AgendamentoUpdateManyWithWhereWithoutClienteInput | AgendamentoUpdateManyWithWhereWithoutClienteInput[]
    deleteMany?: AgendamentoScalarWhereInput | AgendamentoScalarWhereInput[]
  }

  export type FilialCreateNestedOneWithoutBarbeirosInput = {
    create?: XOR<FilialCreateWithoutBarbeirosInput, FilialUncheckedCreateWithoutBarbeirosInput>
    connectOrCreate?: FilialCreateOrConnectWithoutBarbeirosInput
    connect?: FilialWhereUniqueInput
  }

  export type UsuarioCreateNestedOneWithoutBarbeiroInput = {
    create?: XOR<UsuarioCreateWithoutBarbeiroInput, UsuarioUncheckedCreateWithoutBarbeiroInput>
    connectOrCreate?: UsuarioCreateOrConnectWithoutBarbeiroInput
    connect?: UsuarioWhereUniqueInput
  }

  export type AgendamentoCreateNestedManyWithoutBarbeiroInput = {
    create?: XOR<AgendamentoCreateWithoutBarbeiroInput, AgendamentoUncheckedCreateWithoutBarbeiroInput> | AgendamentoCreateWithoutBarbeiroInput[] | AgendamentoUncheckedCreateWithoutBarbeiroInput[]
    connectOrCreate?: AgendamentoCreateOrConnectWithoutBarbeiroInput | AgendamentoCreateOrConnectWithoutBarbeiroInput[]
    createMany?: AgendamentoCreateManyBarbeiroInputEnvelope
    connect?: AgendamentoWhereUniqueInput | AgendamentoWhereUniqueInput[]
  }

  export type AgendamentoUncheckedCreateNestedManyWithoutBarbeiroInput = {
    create?: XOR<AgendamentoCreateWithoutBarbeiroInput, AgendamentoUncheckedCreateWithoutBarbeiroInput> | AgendamentoCreateWithoutBarbeiroInput[] | AgendamentoUncheckedCreateWithoutBarbeiroInput[]
    connectOrCreate?: AgendamentoCreateOrConnectWithoutBarbeiroInput | AgendamentoCreateOrConnectWithoutBarbeiroInput[]
    createMany?: AgendamentoCreateManyBarbeiroInputEnvelope
    connect?: AgendamentoWhereUniqueInput | AgendamentoWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumStatusBarbeiroFieldUpdateOperationsInput = {
    set?: $Enums.StatusBarbeiro
  }

  export type FilialUpdateOneRequiredWithoutBarbeirosNestedInput = {
    create?: XOR<FilialCreateWithoutBarbeirosInput, FilialUncheckedCreateWithoutBarbeirosInput>
    connectOrCreate?: FilialCreateOrConnectWithoutBarbeirosInput
    upsert?: FilialUpsertWithoutBarbeirosInput
    connect?: FilialWhereUniqueInput
    update?: XOR<XOR<FilialUpdateToOneWithWhereWithoutBarbeirosInput, FilialUpdateWithoutBarbeirosInput>, FilialUncheckedUpdateWithoutBarbeirosInput>
  }

  export type UsuarioUpdateOneRequiredWithoutBarbeiroNestedInput = {
    create?: XOR<UsuarioCreateWithoutBarbeiroInput, UsuarioUncheckedCreateWithoutBarbeiroInput>
    connectOrCreate?: UsuarioCreateOrConnectWithoutBarbeiroInput
    upsert?: UsuarioUpsertWithoutBarbeiroInput
    connect?: UsuarioWhereUniqueInput
    update?: XOR<XOR<UsuarioUpdateToOneWithWhereWithoutBarbeiroInput, UsuarioUpdateWithoutBarbeiroInput>, UsuarioUncheckedUpdateWithoutBarbeiroInput>
  }

  export type AgendamentoUpdateManyWithoutBarbeiroNestedInput = {
    create?: XOR<AgendamentoCreateWithoutBarbeiroInput, AgendamentoUncheckedCreateWithoutBarbeiroInput> | AgendamentoCreateWithoutBarbeiroInput[] | AgendamentoUncheckedCreateWithoutBarbeiroInput[]
    connectOrCreate?: AgendamentoCreateOrConnectWithoutBarbeiroInput | AgendamentoCreateOrConnectWithoutBarbeiroInput[]
    upsert?: AgendamentoUpsertWithWhereUniqueWithoutBarbeiroInput | AgendamentoUpsertWithWhereUniqueWithoutBarbeiroInput[]
    createMany?: AgendamentoCreateManyBarbeiroInputEnvelope
    set?: AgendamentoWhereUniqueInput | AgendamentoWhereUniqueInput[]
    disconnect?: AgendamentoWhereUniqueInput | AgendamentoWhereUniqueInput[]
    delete?: AgendamentoWhereUniqueInput | AgendamentoWhereUniqueInput[]
    connect?: AgendamentoWhereUniqueInput | AgendamentoWhereUniqueInput[]
    update?: AgendamentoUpdateWithWhereUniqueWithoutBarbeiroInput | AgendamentoUpdateWithWhereUniqueWithoutBarbeiroInput[]
    updateMany?: AgendamentoUpdateManyWithWhereWithoutBarbeiroInput | AgendamentoUpdateManyWithWhereWithoutBarbeiroInput[]
    deleteMany?: AgendamentoScalarWhereInput | AgendamentoScalarWhereInput[]
  }

  export type AgendamentoUncheckedUpdateManyWithoutBarbeiroNestedInput = {
    create?: XOR<AgendamentoCreateWithoutBarbeiroInput, AgendamentoUncheckedCreateWithoutBarbeiroInput> | AgendamentoCreateWithoutBarbeiroInput[] | AgendamentoUncheckedCreateWithoutBarbeiroInput[]
    connectOrCreate?: AgendamentoCreateOrConnectWithoutBarbeiroInput | AgendamentoCreateOrConnectWithoutBarbeiroInput[]
    upsert?: AgendamentoUpsertWithWhereUniqueWithoutBarbeiroInput | AgendamentoUpsertWithWhereUniqueWithoutBarbeiroInput[]
    createMany?: AgendamentoCreateManyBarbeiroInputEnvelope
    set?: AgendamentoWhereUniqueInput | AgendamentoWhereUniqueInput[]
    disconnect?: AgendamentoWhereUniqueInput | AgendamentoWhereUniqueInput[]
    delete?: AgendamentoWhereUniqueInput | AgendamentoWhereUniqueInput[]
    connect?: AgendamentoWhereUniqueInput | AgendamentoWhereUniqueInput[]
    update?: AgendamentoUpdateWithWhereUniqueWithoutBarbeiroInput | AgendamentoUpdateWithWhereUniqueWithoutBarbeiroInput[]
    updateMany?: AgendamentoUpdateManyWithWhereWithoutBarbeiroInput | AgendamentoUpdateManyWithWhereWithoutBarbeiroInput[]
    deleteMany?: AgendamentoScalarWhereInput | AgendamentoScalarWhereInput[]
  }

  export type EnderecoCreateNestedOneWithoutFilialInput = {
    create?: XOR<EnderecoCreateWithoutFilialInput, EnderecoUncheckedCreateWithoutFilialInput>
    connectOrCreate?: EnderecoCreateOrConnectWithoutFilialInput
    connect?: EnderecoWhereUniqueInput
  }

  export type BarbeiroCreateNestedManyWithoutFilialInput = {
    create?: XOR<BarbeiroCreateWithoutFilialInput, BarbeiroUncheckedCreateWithoutFilialInput> | BarbeiroCreateWithoutFilialInput[] | BarbeiroUncheckedCreateWithoutFilialInput[]
    connectOrCreate?: BarbeiroCreateOrConnectWithoutFilialInput | BarbeiroCreateOrConnectWithoutFilialInput[]
    createMany?: BarbeiroCreateManyFilialInputEnvelope
    connect?: BarbeiroWhereUniqueInput | BarbeiroWhereUniqueInput[]
  }

  export type AgendamentoCreateNestedManyWithoutFilialInput = {
    create?: XOR<AgendamentoCreateWithoutFilialInput, AgendamentoUncheckedCreateWithoutFilialInput> | AgendamentoCreateWithoutFilialInput[] | AgendamentoUncheckedCreateWithoutFilialInput[]
    connectOrCreate?: AgendamentoCreateOrConnectWithoutFilialInput | AgendamentoCreateOrConnectWithoutFilialInput[]
    createMany?: AgendamentoCreateManyFilialInputEnvelope
    connect?: AgendamentoWhereUniqueInput | AgendamentoWhereUniqueInput[]
  }

  export type BarbeiroUncheckedCreateNestedManyWithoutFilialInput = {
    create?: XOR<BarbeiroCreateWithoutFilialInput, BarbeiroUncheckedCreateWithoutFilialInput> | BarbeiroCreateWithoutFilialInput[] | BarbeiroUncheckedCreateWithoutFilialInput[]
    connectOrCreate?: BarbeiroCreateOrConnectWithoutFilialInput | BarbeiroCreateOrConnectWithoutFilialInput[]
    createMany?: BarbeiroCreateManyFilialInputEnvelope
    connect?: BarbeiroWhereUniqueInput | BarbeiroWhereUniqueInput[]
  }

  export type AgendamentoUncheckedCreateNestedManyWithoutFilialInput = {
    create?: XOR<AgendamentoCreateWithoutFilialInput, AgendamentoUncheckedCreateWithoutFilialInput> | AgendamentoCreateWithoutFilialInput[] | AgendamentoUncheckedCreateWithoutFilialInput[]
    connectOrCreate?: AgendamentoCreateOrConnectWithoutFilialInput | AgendamentoCreateOrConnectWithoutFilialInput[]
    createMany?: AgendamentoCreateManyFilialInputEnvelope
    connect?: AgendamentoWhereUniqueInput | AgendamentoWhereUniqueInput[]
  }

  export type EnderecoUpdateOneRequiredWithoutFilialNestedInput = {
    create?: XOR<EnderecoCreateWithoutFilialInput, EnderecoUncheckedCreateWithoutFilialInput>
    connectOrCreate?: EnderecoCreateOrConnectWithoutFilialInput
    upsert?: EnderecoUpsertWithoutFilialInput
    connect?: EnderecoWhereUniqueInput
    update?: XOR<XOR<EnderecoUpdateToOneWithWhereWithoutFilialInput, EnderecoUpdateWithoutFilialInput>, EnderecoUncheckedUpdateWithoutFilialInput>
  }

  export type BarbeiroUpdateManyWithoutFilialNestedInput = {
    create?: XOR<BarbeiroCreateWithoutFilialInput, BarbeiroUncheckedCreateWithoutFilialInput> | BarbeiroCreateWithoutFilialInput[] | BarbeiroUncheckedCreateWithoutFilialInput[]
    connectOrCreate?: BarbeiroCreateOrConnectWithoutFilialInput | BarbeiroCreateOrConnectWithoutFilialInput[]
    upsert?: BarbeiroUpsertWithWhereUniqueWithoutFilialInput | BarbeiroUpsertWithWhereUniqueWithoutFilialInput[]
    createMany?: BarbeiroCreateManyFilialInputEnvelope
    set?: BarbeiroWhereUniqueInput | BarbeiroWhereUniqueInput[]
    disconnect?: BarbeiroWhereUniqueInput | BarbeiroWhereUniqueInput[]
    delete?: BarbeiroWhereUniqueInput | BarbeiroWhereUniqueInput[]
    connect?: BarbeiroWhereUniqueInput | BarbeiroWhereUniqueInput[]
    update?: BarbeiroUpdateWithWhereUniqueWithoutFilialInput | BarbeiroUpdateWithWhereUniqueWithoutFilialInput[]
    updateMany?: BarbeiroUpdateManyWithWhereWithoutFilialInput | BarbeiroUpdateManyWithWhereWithoutFilialInput[]
    deleteMany?: BarbeiroScalarWhereInput | BarbeiroScalarWhereInput[]
  }

  export type AgendamentoUpdateManyWithoutFilialNestedInput = {
    create?: XOR<AgendamentoCreateWithoutFilialInput, AgendamentoUncheckedCreateWithoutFilialInput> | AgendamentoCreateWithoutFilialInput[] | AgendamentoUncheckedCreateWithoutFilialInput[]
    connectOrCreate?: AgendamentoCreateOrConnectWithoutFilialInput | AgendamentoCreateOrConnectWithoutFilialInput[]
    upsert?: AgendamentoUpsertWithWhereUniqueWithoutFilialInput | AgendamentoUpsertWithWhereUniqueWithoutFilialInput[]
    createMany?: AgendamentoCreateManyFilialInputEnvelope
    set?: AgendamentoWhereUniqueInput | AgendamentoWhereUniqueInput[]
    disconnect?: AgendamentoWhereUniqueInput | AgendamentoWhereUniqueInput[]
    delete?: AgendamentoWhereUniqueInput | AgendamentoWhereUniqueInput[]
    connect?: AgendamentoWhereUniqueInput | AgendamentoWhereUniqueInput[]
    update?: AgendamentoUpdateWithWhereUniqueWithoutFilialInput | AgendamentoUpdateWithWhereUniqueWithoutFilialInput[]
    updateMany?: AgendamentoUpdateManyWithWhereWithoutFilialInput | AgendamentoUpdateManyWithWhereWithoutFilialInput[]
    deleteMany?: AgendamentoScalarWhereInput | AgendamentoScalarWhereInput[]
  }

  export type BarbeiroUncheckedUpdateManyWithoutFilialNestedInput = {
    create?: XOR<BarbeiroCreateWithoutFilialInput, BarbeiroUncheckedCreateWithoutFilialInput> | BarbeiroCreateWithoutFilialInput[] | BarbeiroUncheckedCreateWithoutFilialInput[]
    connectOrCreate?: BarbeiroCreateOrConnectWithoutFilialInput | BarbeiroCreateOrConnectWithoutFilialInput[]
    upsert?: BarbeiroUpsertWithWhereUniqueWithoutFilialInput | BarbeiroUpsertWithWhereUniqueWithoutFilialInput[]
    createMany?: BarbeiroCreateManyFilialInputEnvelope
    set?: BarbeiroWhereUniqueInput | BarbeiroWhereUniqueInput[]
    disconnect?: BarbeiroWhereUniqueInput | BarbeiroWhereUniqueInput[]
    delete?: BarbeiroWhereUniqueInput | BarbeiroWhereUniqueInput[]
    connect?: BarbeiroWhereUniqueInput | BarbeiroWhereUniqueInput[]
    update?: BarbeiroUpdateWithWhereUniqueWithoutFilialInput | BarbeiroUpdateWithWhereUniqueWithoutFilialInput[]
    updateMany?: BarbeiroUpdateManyWithWhereWithoutFilialInput | BarbeiroUpdateManyWithWhereWithoutFilialInput[]
    deleteMany?: BarbeiroScalarWhereInput | BarbeiroScalarWhereInput[]
  }

  export type AgendamentoUncheckedUpdateManyWithoutFilialNestedInput = {
    create?: XOR<AgendamentoCreateWithoutFilialInput, AgendamentoUncheckedCreateWithoutFilialInput> | AgendamentoCreateWithoutFilialInput[] | AgendamentoUncheckedCreateWithoutFilialInput[]
    connectOrCreate?: AgendamentoCreateOrConnectWithoutFilialInput | AgendamentoCreateOrConnectWithoutFilialInput[]
    upsert?: AgendamentoUpsertWithWhereUniqueWithoutFilialInput | AgendamentoUpsertWithWhereUniqueWithoutFilialInput[]
    createMany?: AgendamentoCreateManyFilialInputEnvelope
    set?: AgendamentoWhereUniqueInput | AgendamentoWhereUniqueInput[]
    disconnect?: AgendamentoWhereUniqueInput | AgendamentoWhereUniqueInput[]
    delete?: AgendamentoWhereUniqueInput | AgendamentoWhereUniqueInput[]
    connect?: AgendamentoWhereUniqueInput | AgendamentoWhereUniqueInput[]
    update?: AgendamentoUpdateWithWhereUniqueWithoutFilialInput | AgendamentoUpdateWithWhereUniqueWithoutFilialInput[]
    updateMany?: AgendamentoUpdateManyWithWhereWithoutFilialInput | AgendamentoUpdateManyWithWhereWithoutFilialInput[]
    deleteMany?: AgendamentoScalarWhereInput | AgendamentoScalarWhereInput[]
  }

  export type FilialCreateNestedOneWithoutEnderecoInput = {
    create?: XOR<FilialCreateWithoutEnderecoInput, FilialUncheckedCreateWithoutEnderecoInput>
    connectOrCreate?: FilialCreateOrConnectWithoutEnderecoInput
    connect?: FilialWhereUniqueInput
  }

  export type FilialUncheckedCreateNestedOneWithoutEnderecoInput = {
    create?: XOR<FilialCreateWithoutEnderecoInput, FilialUncheckedCreateWithoutEnderecoInput>
    connectOrCreate?: FilialCreateOrConnectWithoutEnderecoInput
    connect?: FilialWhereUniqueInput
  }

  export type FilialUpdateOneWithoutEnderecoNestedInput = {
    create?: XOR<FilialCreateWithoutEnderecoInput, FilialUncheckedCreateWithoutEnderecoInput>
    connectOrCreate?: FilialCreateOrConnectWithoutEnderecoInput
    upsert?: FilialUpsertWithoutEnderecoInput
    disconnect?: FilialWhereInput | boolean
    delete?: FilialWhereInput | boolean
    connect?: FilialWhereUniqueInput
    update?: XOR<XOR<FilialUpdateToOneWithWhereWithoutEnderecoInput, FilialUpdateWithoutEnderecoInput>, FilialUncheckedUpdateWithoutEnderecoInput>
  }

  export type FilialUncheckedUpdateOneWithoutEnderecoNestedInput = {
    create?: XOR<FilialCreateWithoutEnderecoInput, FilialUncheckedCreateWithoutEnderecoInput>
    connectOrCreate?: FilialCreateOrConnectWithoutEnderecoInput
    upsert?: FilialUpsertWithoutEnderecoInput
    disconnect?: FilialWhereInput | boolean
    delete?: FilialWhereInput | boolean
    connect?: FilialWhereUniqueInput
    update?: XOR<XOR<FilialUpdateToOneWithWhereWithoutEnderecoInput, FilialUpdateWithoutEnderecoInput>, FilialUncheckedUpdateWithoutEnderecoInput>
  }

  export type AgendamentoServicoCreateNestedManyWithoutServicoInput = {
    create?: XOR<AgendamentoServicoCreateWithoutServicoInput, AgendamentoServicoUncheckedCreateWithoutServicoInput> | AgendamentoServicoCreateWithoutServicoInput[] | AgendamentoServicoUncheckedCreateWithoutServicoInput[]
    connectOrCreate?: AgendamentoServicoCreateOrConnectWithoutServicoInput | AgendamentoServicoCreateOrConnectWithoutServicoInput[]
    createMany?: AgendamentoServicoCreateManyServicoInputEnvelope
    connect?: AgendamentoServicoWhereUniqueInput | AgendamentoServicoWhereUniqueInput[]
  }

  export type AgendamentoServicoUncheckedCreateNestedManyWithoutServicoInput = {
    create?: XOR<AgendamentoServicoCreateWithoutServicoInput, AgendamentoServicoUncheckedCreateWithoutServicoInput> | AgendamentoServicoCreateWithoutServicoInput[] | AgendamentoServicoUncheckedCreateWithoutServicoInput[]
    connectOrCreate?: AgendamentoServicoCreateOrConnectWithoutServicoInput | AgendamentoServicoCreateOrConnectWithoutServicoInput[]
    createMany?: AgendamentoServicoCreateManyServicoInputEnvelope
    connect?: AgendamentoServicoWhereUniqueInput | AgendamentoServicoWhereUniqueInput[]
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type AgendamentoServicoUpdateManyWithoutServicoNestedInput = {
    create?: XOR<AgendamentoServicoCreateWithoutServicoInput, AgendamentoServicoUncheckedCreateWithoutServicoInput> | AgendamentoServicoCreateWithoutServicoInput[] | AgendamentoServicoUncheckedCreateWithoutServicoInput[]
    connectOrCreate?: AgendamentoServicoCreateOrConnectWithoutServicoInput | AgendamentoServicoCreateOrConnectWithoutServicoInput[]
    upsert?: AgendamentoServicoUpsertWithWhereUniqueWithoutServicoInput | AgendamentoServicoUpsertWithWhereUniqueWithoutServicoInput[]
    createMany?: AgendamentoServicoCreateManyServicoInputEnvelope
    set?: AgendamentoServicoWhereUniqueInput | AgendamentoServicoWhereUniqueInput[]
    disconnect?: AgendamentoServicoWhereUniqueInput | AgendamentoServicoWhereUniqueInput[]
    delete?: AgendamentoServicoWhereUniqueInput | AgendamentoServicoWhereUniqueInput[]
    connect?: AgendamentoServicoWhereUniqueInput | AgendamentoServicoWhereUniqueInput[]
    update?: AgendamentoServicoUpdateWithWhereUniqueWithoutServicoInput | AgendamentoServicoUpdateWithWhereUniqueWithoutServicoInput[]
    updateMany?: AgendamentoServicoUpdateManyWithWhereWithoutServicoInput | AgendamentoServicoUpdateManyWithWhereWithoutServicoInput[]
    deleteMany?: AgendamentoServicoScalarWhereInput | AgendamentoServicoScalarWhereInput[]
  }

  export type AgendamentoServicoUncheckedUpdateManyWithoutServicoNestedInput = {
    create?: XOR<AgendamentoServicoCreateWithoutServicoInput, AgendamentoServicoUncheckedCreateWithoutServicoInput> | AgendamentoServicoCreateWithoutServicoInput[] | AgendamentoServicoUncheckedCreateWithoutServicoInput[]
    connectOrCreate?: AgendamentoServicoCreateOrConnectWithoutServicoInput | AgendamentoServicoCreateOrConnectWithoutServicoInput[]
    upsert?: AgendamentoServicoUpsertWithWhereUniqueWithoutServicoInput | AgendamentoServicoUpsertWithWhereUniqueWithoutServicoInput[]
    createMany?: AgendamentoServicoCreateManyServicoInputEnvelope
    set?: AgendamentoServicoWhereUniqueInput | AgendamentoServicoWhereUniqueInput[]
    disconnect?: AgendamentoServicoWhereUniqueInput | AgendamentoServicoWhereUniqueInput[]
    delete?: AgendamentoServicoWhereUniqueInput | AgendamentoServicoWhereUniqueInput[]
    connect?: AgendamentoServicoWhereUniqueInput | AgendamentoServicoWhereUniqueInput[]
    update?: AgendamentoServicoUpdateWithWhereUniqueWithoutServicoInput | AgendamentoServicoUpdateWithWhereUniqueWithoutServicoInput[]
    updateMany?: AgendamentoServicoUpdateManyWithWhereWithoutServicoInput | AgendamentoServicoUpdateManyWithWhereWithoutServicoInput[]
    deleteMany?: AgendamentoServicoScalarWhereInput | AgendamentoServicoScalarWhereInput[]
  }

  export type ClienteCreateNestedOneWithoutAgendamentosInput = {
    create?: XOR<ClienteCreateWithoutAgendamentosInput, ClienteUncheckedCreateWithoutAgendamentosInput>
    connectOrCreate?: ClienteCreateOrConnectWithoutAgendamentosInput
    connect?: ClienteWhereUniqueInput
  }

  export type BarbeiroCreateNestedOneWithoutAgendamentosInput = {
    create?: XOR<BarbeiroCreateWithoutAgendamentosInput, BarbeiroUncheckedCreateWithoutAgendamentosInput>
    connectOrCreate?: BarbeiroCreateOrConnectWithoutAgendamentosInput
    connect?: BarbeiroWhereUniqueInput
  }

  export type FilialCreateNestedOneWithoutAgendamentosInput = {
    create?: XOR<FilialCreateWithoutAgendamentosInput, FilialUncheckedCreateWithoutAgendamentosInput>
    connectOrCreate?: FilialCreateOrConnectWithoutAgendamentosInput
    connect?: FilialWhereUniqueInput
  }

  export type AgendamentoServicoCreateNestedManyWithoutAgendamentoInput = {
    create?: XOR<AgendamentoServicoCreateWithoutAgendamentoInput, AgendamentoServicoUncheckedCreateWithoutAgendamentoInput> | AgendamentoServicoCreateWithoutAgendamentoInput[] | AgendamentoServicoUncheckedCreateWithoutAgendamentoInput[]
    connectOrCreate?: AgendamentoServicoCreateOrConnectWithoutAgendamentoInput | AgendamentoServicoCreateOrConnectWithoutAgendamentoInput[]
    createMany?: AgendamentoServicoCreateManyAgendamentoInputEnvelope
    connect?: AgendamentoServicoWhereUniqueInput | AgendamentoServicoWhereUniqueInput[]
  }

  export type AgendamentoServicoUncheckedCreateNestedManyWithoutAgendamentoInput = {
    create?: XOR<AgendamentoServicoCreateWithoutAgendamentoInput, AgendamentoServicoUncheckedCreateWithoutAgendamentoInput> | AgendamentoServicoCreateWithoutAgendamentoInput[] | AgendamentoServicoUncheckedCreateWithoutAgendamentoInput[]
    connectOrCreate?: AgendamentoServicoCreateOrConnectWithoutAgendamentoInput | AgendamentoServicoCreateOrConnectWithoutAgendamentoInput[]
    createMany?: AgendamentoServicoCreateManyAgendamentoInputEnvelope
    connect?: AgendamentoServicoWhereUniqueInput | AgendamentoServicoWhereUniqueInput[]
  }

  export type EnumStatusAgendamentoFieldUpdateOperationsInput = {
    set?: $Enums.StatusAgendamento
  }

  export type ClienteUpdateOneRequiredWithoutAgendamentosNestedInput = {
    create?: XOR<ClienteCreateWithoutAgendamentosInput, ClienteUncheckedCreateWithoutAgendamentosInput>
    connectOrCreate?: ClienteCreateOrConnectWithoutAgendamentosInput
    upsert?: ClienteUpsertWithoutAgendamentosInput
    connect?: ClienteWhereUniqueInput
    update?: XOR<XOR<ClienteUpdateToOneWithWhereWithoutAgendamentosInput, ClienteUpdateWithoutAgendamentosInput>, ClienteUncheckedUpdateWithoutAgendamentosInput>
  }

  export type BarbeiroUpdateOneRequiredWithoutAgendamentosNestedInput = {
    create?: XOR<BarbeiroCreateWithoutAgendamentosInput, BarbeiroUncheckedCreateWithoutAgendamentosInput>
    connectOrCreate?: BarbeiroCreateOrConnectWithoutAgendamentosInput
    upsert?: BarbeiroUpsertWithoutAgendamentosInput
    connect?: BarbeiroWhereUniqueInput
    update?: XOR<XOR<BarbeiroUpdateToOneWithWhereWithoutAgendamentosInput, BarbeiroUpdateWithoutAgendamentosInput>, BarbeiroUncheckedUpdateWithoutAgendamentosInput>
  }

  export type FilialUpdateOneRequiredWithoutAgendamentosNestedInput = {
    create?: XOR<FilialCreateWithoutAgendamentosInput, FilialUncheckedCreateWithoutAgendamentosInput>
    connectOrCreate?: FilialCreateOrConnectWithoutAgendamentosInput
    upsert?: FilialUpsertWithoutAgendamentosInput
    connect?: FilialWhereUniqueInput
    update?: XOR<XOR<FilialUpdateToOneWithWhereWithoutAgendamentosInput, FilialUpdateWithoutAgendamentosInput>, FilialUncheckedUpdateWithoutAgendamentosInput>
  }

  export type AgendamentoServicoUpdateManyWithoutAgendamentoNestedInput = {
    create?: XOR<AgendamentoServicoCreateWithoutAgendamentoInput, AgendamentoServicoUncheckedCreateWithoutAgendamentoInput> | AgendamentoServicoCreateWithoutAgendamentoInput[] | AgendamentoServicoUncheckedCreateWithoutAgendamentoInput[]
    connectOrCreate?: AgendamentoServicoCreateOrConnectWithoutAgendamentoInput | AgendamentoServicoCreateOrConnectWithoutAgendamentoInput[]
    upsert?: AgendamentoServicoUpsertWithWhereUniqueWithoutAgendamentoInput | AgendamentoServicoUpsertWithWhereUniqueWithoutAgendamentoInput[]
    createMany?: AgendamentoServicoCreateManyAgendamentoInputEnvelope
    set?: AgendamentoServicoWhereUniqueInput | AgendamentoServicoWhereUniqueInput[]
    disconnect?: AgendamentoServicoWhereUniqueInput | AgendamentoServicoWhereUniqueInput[]
    delete?: AgendamentoServicoWhereUniqueInput | AgendamentoServicoWhereUniqueInput[]
    connect?: AgendamentoServicoWhereUniqueInput | AgendamentoServicoWhereUniqueInput[]
    update?: AgendamentoServicoUpdateWithWhereUniqueWithoutAgendamentoInput | AgendamentoServicoUpdateWithWhereUniqueWithoutAgendamentoInput[]
    updateMany?: AgendamentoServicoUpdateManyWithWhereWithoutAgendamentoInput | AgendamentoServicoUpdateManyWithWhereWithoutAgendamentoInput[]
    deleteMany?: AgendamentoServicoScalarWhereInput | AgendamentoServicoScalarWhereInput[]
  }

  export type AgendamentoServicoUncheckedUpdateManyWithoutAgendamentoNestedInput = {
    create?: XOR<AgendamentoServicoCreateWithoutAgendamentoInput, AgendamentoServicoUncheckedCreateWithoutAgendamentoInput> | AgendamentoServicoCreateWithoutAgendamentoInput[] | AgendamentoServicoUncheckedCreateWithoutAgendamentoInput[]
    connectOrCreate?: AgendamentoServicoCreateOrConnectWithoutAgendamentoInput | AgendamentoServicoCreateOrConnectWithoutAgendamentoInput[]
    upsert?: AgendamentoServicoUpsertWithWhereUniqueWithoutAgendamentoInput | AgendamentoServicoUpsertWithWhereUniqueWithoutAgendamentoInput[]
    createMany?: AgendamentoServicoCreateManyAgendamentoInputEnvelope
    set?: AgendamentoServicoWhereUniqueInput | AgendamentoServicoWhereUniqueInput[]
    disconnect?: AgendamentoServicoWhereUniqueInput | AgendamentoServicoWhereUniqueInput[]
    delete?: AgendamentoServicoWhereUniqueInput | AgendamentoServicoWhereUniqueInput[]
    connect?: AgendamentoServicoWhereUniqueInput | AgendamentoServicoWhereUniqueInput[]
    update?: AgendamentoServicoUpdateWithWhereUniqueWithoutAgendamentoInput | AgendamentoServicoUpdateWithWhereUniqueWithoutAgendamentoInput[]
    updateMany?: AgendamentoServicoUpdateManyWithWhereWithoutAgendamentoInput | AgendamentoServicoUpdateManyWithWhereWithoutAgendamentoInput[]
    deleteMany?: AgendamentoServicoScalarWhereInput | AgendamentoServicoScalarWhereInput[]
  }

  export type AgendamentoCreateNestedOneWithoutServicosInput = {
    create?: XOR<AgendamentoCreateWithoutServicosInput, AgendamentoUncheckedCreateWithoutServicosInput>
    connectOrCreate?: AgendamentoCreateOrConnectWithoutServicosInput
    connect?: AgendamentoWhereUniqueInput
  }

  export type ServicoCreateNestedOneWithoutAgendamentosInput = {
    create?: XOR<ServicoCreateWithoutAgendamentosInput, ServicoUncheckedCreateWithoutAgendamentosInput>
    connectOrCreate?: ServicoCreateOrConnectWithoutAgendamentosInput
    connect?: ServicoWhereUniqueInput
  }

  export type AgendamentoUpdateOneRequiredWithoutServicosNestedInput = {
    create?: XOR<AgendamentoCreateWithoutServicosInput, AgendamentoUncheckedCreateWithoutServicosInput>
    connectOrCreate?: AgendamentoCreateOrConnectWithoutServicosInput
    upsert?: AgendamentoUpsertWithoutServicosInput
    connect?: AgendamentoWhereUniqueInput
    update?: XOR<XOR<AgendamentoUpdateToOneWithWhereWithoutServicosInput, AgendamentoUpdateWithoutServicosInput>, AgendamentoUncheckedUpdateWithoutServicosInput>
  }

  export type ServicoUpdateOneRequiredWithoutAgendamentosNestedInput = {
    create?: XOR<ServicoCreateWithoutAgendamentosInput, ServicoUncheckedCreateWithoutAgendamentosInput>
    connectOrCreate?: ServicoCreateOrConnectWithoutAgendamentosInput
    upsert?: ServicoUpsertWithoutAgendamentosInput
    connect?: ServicoWhereUniqueInput
    update?: XOR<XOR<ServicoUpdateToOneWithWhereWithoutAgendamentosInput, ServicoUpdateWithoutAgendamentosInput>, ServicoUncheckedUpdateWithoutAgendamentosInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedEnumTipoPerfilFilter<$PrismaModel = never> = {
    equals?: $Enums.TipoPerfil | EnumTipoPerfilFieldRefInput<$PrismaModel>
    in?: $Enums.TipoPerfil[] | ListEnumTipoPerfilFieldRefInput<$PrismaModel>
    notIn?: $Enums.TipoPerfil[] | ListEnumTipoPerfilFieldRefInput<$PrismaModel>
    not?: NestedEnumTipoPerfilFilter<$PrismaModel> | $Enums.TipoPerfil
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumTipoPerfilWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TipoPerfil | EnumTipoPerfilFieldRefInput<$PrismaModel>
    in?: $Enums.TipoPerfil[] | ListEnumTipoPerfilFieldRefInput<$PrismaModel>
    notIn?: $Enums.TipoPerfil[] | ListEnumTipoPerfilFieldRefInput<$PrismaModel>
    not?: NestedEnumTipoPerfilWithAggregatesFilter<$PrismaModel> | $Enums.TipoPerfil
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTipoPerfilFilter<$PrismaModel>
    _max?: NestedEnumTipoPerfilFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumStatusBarbeiroFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusBarbeiro | EnumStatusBarbeiroFieldRefInput<$PrismaModel>
    in?: $Enums.StatusBarbeiro[] | ListEnumStatusBarbeiroFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusBarbeiro[] | ListEnumStatusBarbeiroFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusBarbeiroFilter<$PrismaModel> | $Enums.StatusBarbeiro
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedEnumStatusBarbeiroWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusBarbeiro | EnumStatusBarbeiroFieldRefInput<$PrismaModel>
    in?: $Enums.StatusBarbeiro[] | ListEnumStatusBarbeiroFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusBarbeiro[] | ListEnumStatusBarbeiroFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusBarbeiroWithAggregatesFilter<$PrismaModel> | $Enums.StatusBarbeiro
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStatusBarbeiroFilter<$PrismaModel>
    _max?: NestedEnumStatusBarbeiroFilter<$PrismaModel>
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedEnumStatusAgendamentoFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusAgendamento | EnumStatusAgendamentoFieldRefInput<$PrismaModel>
    in?: $Enums.StatusAgendamento[] | ListEnumStatusAgendamentoFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusAgendamento[] | ListEnumStatusAgendamentoFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusAgendamentoFilter<$PrismaModel> | $Enums.StatusAgendamento
  }

  export type NestedEnumStatusAgendamentoWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusAgendamento | EnumStatusAgendamentoFieldRefInput<$PrismaModel>
    in?: $Enums.StatusAgendamento[] | ListEnumStatusAgendamentoFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusAgendamento[] | ListEnumStatusAgendamentoFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusAgendamentoWithAggregatesFilter<$PrismaModel> | $Enums.StatusAgendamento
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStatusAgendamentoFilter<$PrismaModel>
    _max?: NestedEnumStatusAgendamentoFilter<$PrismaModel>
  }

  export type ClienteCreateWithoutUsuarioInput = {
    cpf: string
    dataNascimento?: Date | string | null
    agendamentos?: AgendamentoCreateNestedManyWithoutClienteInput
  }

  export type ClienteUncheckedCreateWithoutUsuarioInput = {
    cpf: string
    dataNascimento?: Date | string | null
    agendamentos?: AgendamentoUncheckedCreateNestedManyWithoutClienteInput
  }

  export type ClienteCreateOrConnectWithoutUsuarioInput = {
    where: ClienteWhereUniqueInput
    create: XOR<ClienteCreateWithoutUsuarioInput, ClienteUncheckedCreateWithoutUsuarioInput>
  }

  export type BarbeiroCreateWithoutUsuarioInput = {
    descricao?: string | null
    dataAdmissao?: Date | string | null
    status?: $Enums.StatusBarbeiro
    filial: FilialCreateNestedOneWithoutBarbeirosInput
    agendamentos?: AgendamentoCreateNestedManyWithoutBarbeiroInput
  }

  export type BarbeiroUncheckedCreateWithoutUsuarioInput = {
    descricao?: string | null
    dataAdmissao?: Date | string | null
    status?: $Enums.StatusBarbeiro
    idFilial: number
    agendamentos?: AgendamentoUncheckedCreateNestedManyWithoutBarbeiroInput
  }

  export type BarbeiroCreateOrConnectWithoutUsuarioInput = {
    where: BarbeiroWhereUniqueInput
    create: XOR<BarbeiroCreateWithoutUsuarioInput, BarbeiroUncheckedCreateWithoutUsuarioInput>
  }

  export type ClienteUpsertWithoutUsuarioInput = {
    update: XOR<ClienteUpdateWithoutUsuarioInput, ClienteUncheckedUpdateWithoutUsuarioInput>
    create: XOR<ClienteCreateWithoutUsuarioInput, ClienteUncheckedCreateWithoutUsuarioInput>
    where?: ClienteWhereInput
  }

  export type ClienteUpdateToOneWithWhereWithoutUsuarioInput = {
    where?: ClienteWhereInput
    data: XOR<ClienteUpdateWithoutUsuarioInput, ClienteUncheckedUpdateWithoutUsuarioInput>
  }

  export type ClienteUpdateWithoutUsuarioInput = {
    cpf?: StringFieldUpdateOperationsInput | string
    dataNascimento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    agendamentos?: AgendamentoUpdateManyWithoutClienteNestedInput
  }

  export type ClienteUncheckedUpdateWithoutUsuarioInput = {
    cpf?: StringFieldUpdateOperationsInput | string
    dataNascimento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    agendamentos?: AgendamentoUncheckedUpdateManyWithoutClienteNestedInput
  }

  export type BarbeiroUpsertWithoutUsuarioInput = {
    update: XOR<BarbeiroUpdateWithoutUsuarioInput, BarbeiroUncheckedUpdateWithoutUsuarioInput>
    create: XOR<BarbeiroCreateWithoutUsuarioInput, BarbeiroUncheckedCreateWithoutUsuarioInput>
    where?: BarbeiroWhereInput
  }

  export type BarbeiroUpdateToOneWithWhereWithoutUsuarioInput = {
    where?: BarbeiroWhereInput
    data: XOR<BarbeiroUpdateWithoutUsuarioInput, BarbeiroUncheckedUpdateWithoutUsuarioInput>
  }

  export type BarbeiroUpdateWithoutUsuarioInput = {
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    dataAdmissao?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumStatusBarbeiroFieldUpdateOperationsInput | $Enums.StatusBarbeiro
    filial?: FilialUpdateOneRequiredWithoutBarbeirosNestedInput
    agendamentos?: AgendamentoUpdateManyWithoutBarbeiroNestedInput
  }

  export type BarbeiroUncheckedUpdateWithoutUsuarioInput = {
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    dataAdmissao?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumStatusBarbeiroFieldUpdateOperationsInput | $Enums.StatusBarbeiro
    idFilial?: IntFieldUpdateOperationsInput | number
    agendamentos?: AgendamentoUncheckedUpdateManyWithoutBarbeiroNestedInput
  }

  export type UsuarioCreateWithoutClienteInput = {
    nome: string
    email: string
    senha: string
    dataCadastro?: Date | string
    tipoPerfil: $Enums.TipoPerfil
    createdAt?: Date | string
    updatedAt?: Date | string
    barbeiro?: BarbeiroCreateNestedOneWithoutUsuarioInput
  }

  export type UsuarioUncheckedCreateWithoutClienteInput = {
    id?: number
    nome: string
    email: string
    senha: string
    dataCadastro?: Date | string
    tipoPerfil: $Enums.TipoPerfil
    createdAt?: Date | string
    updatedAt?: Date | string
    barbeiro?: BarbeiroUncheckedCreateNestedOneWithoutUsuarioInput
  }

  export type UsuarioCreateOrConnectWithoutClienteInput = {
    where: UsuarioWhereUniqueInput
    create: XOR<UsuarioCreateWithoutClienteInput, UsuarioUncheckedCreateWithoutClienteInput>
  }

  export type AgendamentoCreateWithoutClienteInput = {
    inicio: Date | string
    fim: Date | string
    status?: $Enums.StatusAgendamento
    observacao?: string | null
    valorTotal: Decimal | DecimalJsLike | number | string
    dataCriacao?: Date | string
    barbeiro: BarbeiroCreateNestedOneWithoutAgendamentosInput
    filial: FilialCreateNestedOneWithoutAgendamentosInput
    servicos?: AgendamentoServicoCreateNestedManyWithoutAgendamentoInput
  }

  export type AgendamentoUncheckedCreateWithoutClienteInput = {
    id?: number
    idBarbeiro: number
    idFilial: number
    inicio: Date | string
    fim: Date | string
    status?: $Enums.StatusAgendamento
    observacao?: string | null
    valorTotal: Decimal | DecimalJsLike | number | string
    dataCriacao?: Date | string
    servicos?: AgendamentoServicoUncheckedCreateNestedManyWithoutAgendamentoInput
  }

  export type AgendamentoCreateOrConnectWithoutClienteInput = {
    where: AgendamentoWhereUniqueInput
    create: XOR<AgendamentoCreateWithoutClienteInput, AgendamentoUncheckedCreateWithoutClienteInput>
  }

  export type AgendamentoCreateManyClienteInputEnvelope = {
    data: AgendamentoCreateManyClienteInput | AgendamentoCreateManyClienteInput[]
    skipDuplicates?: boolean
  }

  export type UsuarioUpsertWithoutClienteInput = {
    update: XOR<UsuarioUpdateWithoutClienteInput, UsuarioUncheckedUpdateWithoutClienteInput>
    create: XOR<UsuarioCreateWithoutClienteInput, UsuarioUncheckedCreateWithoutClienteInput>
    where?: UsuarioWhereInput
  }

  export type UsuarioUpdateToOneWithWhereWithoutClienteInput = {
    where?: UsuarioWhereInput
    data: XOR<UsuarioUpdateWithoutClienteInput, UsuarioUncheckedUpdateWithoutClienteInput>
  }

  export type UsuarioUpdateWithoutClienteInput = {
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    senha?: StringFieldUpdateOperationsInput | string
    dataCadastro?: DateTimeFieldUpdateOperationsInput | Date | string
    tipoPerfil?: EnumTipoPerfilFieldUpdateOperationsInput | $Enums.TipoPerfil
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    barbeiro?: BarbeiroUpdateOneWithoutUsuarioNestedInput
  }

  export type UsuarioUncheckedUpdateWithoutClienteInput = {
    id?: IntFieldUpdateOperationsInput | number
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    senha?: StringFieldUpdateOperationsInput | string
    dataCadastro?: DateTimeFieldUpdateOperationsInput | Date | string
    tipoPerfil?: EnumTipoPerfilFieldUpdateOperationsInput | $Enums.TipoPerfil
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    barbeiro?: BarbeiroUncheckedUpdateOneWithoutUsuarioNestedInput
  }

  export type AgendamentoUpsertWithWhereUniqueWithoutClienteInput = {
    where: AgendamentoWhereUniqueInput
    update: XOR<AgendamentoUpdateWithoutClienteInput, AgendamentoUncheckedUpdateWithoutClienteInput>
    create: XOR<AgendamentoCreateWithoutClienteInput, AgendamentoUncheckedCreateWithoutClienteInput>
  }

  export type AgendamentoUpdateWithWhereUniqueWithoutClienteInput = {
    where: AgendamentoWhereUniqueInput
    data: XOR<AgendamentoUpdateWithoutClienteInput, AgendamentoUncheckedUpdateWithoutClienteInput>
  }

  export type AgendamentoUpdateManyWithWhereWithoutClienteInput = {
    where: AgendamentoScalarWhereInput
    data: XOR<AgendamentoUpdateManyMutationInput, AgendamentoUncheckedUpdateManyWithoutClienteInput>
  }

  export type AgendamentoScalarWhereInput = {
    AND?: AgendamentoScalarWhereInput | AgendamentoScalarWhereInput[]
    OR?: AgendamentoScalarWhereInput[]
    NOT?: AgendamentoScalarWhereInput | AgendamentoScalarWhereInput[]
    id?: IntFilter<"Agendamento"> | number
    idCliente?: IntFilter<"Agendamento"> | number
    idBarbeiro?: IntFilter<"Agendamento"> | number
    idFilial?: IntFilter<"Agendamento"> | number
    inicio?: DateTimeFilter<"Agendamento"> | Date | string
    fim?: DateTimeFilter<"Agendamento"> | Date | string
    status?: EnumStatusAgendamentoFilter<"Agendamento"> | $Enums.StatusAgendamento
    observacao?: StringNullableFilter<"Agendamento"> | string | null
    valorTotal?: DecimalFilter<"Agendamento"> | Decimal | DecimalJsLike | number | string
    dataCriacao?: DateTimeFilter<"Agendamento"> | Date | string
  }

  export type FilialCreateWithoutBarbeirosInput = {
    nome: string
    cnpj: string
    telefone?: string | null
    email?: string | null
    horarioAbertura?: string | null
    horarioFechamento?: string | null
    endereco: EnderecoCreateNestedOneWithoutFilialInput
    agendamentos?: AgendamentoCreateNestedManyWithoutFilialInput
  }

  export type FilialUncheckedCreateWithoutBarbeirosInput = {
    id?: number
    nome: string
    cnpj: string
    telefone?: string | null
    email?: string | null
    horarioAbertura?: string | null
    horarioFechamento?: string | null
    idEndereco: number
    agendamentos?: AgendamentoUncheckedCreateNestedManyWithoutFilialInput
  }

  export type FilialCreateOrConnectWithoutBarbeirosInput = {
    where: FilialWhereUniqueInput
    create: XOR<FilialCreateWithoutBarbeirosInput, FilialUncheckedCreateWithoutBarbeirosInput>
  }

  export type UsuarioCreateWithoutBarbeiroInput = {
    nome: string
    email: string
    senha: string
    dataCadastro?: Date | string
    tipoPerfil: $Enums.TipoPerfil
    createdAt?: Date | string
    updatedAt?: Date | string
    cliente?: ClienteCreateNestedOneWithoutUsuarioInput
  }

  export type UsuarioUncheckedCreateWithoutBarbeiroInput = {
    id?: number
    nome: string
    email: string
    senha: string
    dataCadastro?: Date | string
    tipoPerfil: $Enums.TipoPerfil
    createdAt?: Date | string
    updatedAt?: Date | string
    cliente?: ClienteUncheckedCreateNestedOneWithoutUsuarioInput
  }

  export type UsuarioCreateOrConnectWithoutBarbeiroInput = {
    where: UsuarioWhereUniqueInput
    create: XOR<UsuarioCreateWithoutBarbeiroInput, UsuarioUncheckedCreateWithoutBarbeiroInput>
  }

  export type AgendamentoCreateWithoutBarbeiroInput = {
    inicio: Date | string
    fim: Date | string
    status?: $Enums.StatusAgendamento
    observacao?: string | null
    valorTotal: Decimal | DecimalJsLike | number | string
    dataCriacao?: Date | string
    cliente: ClienteCreateNestedOneWithoutAgendamentosInput
    filial: FilialCreateNestedOneWithoutAgendamentosInput
    servicos?: AgendamentoServicoCreateNestedManyWithoutAgendamentoInput
  }

  export type AgendamentoUncheckedCreateWithoutBarbeiroInput = {
    id?: number
    idCliente: number
    idFilial: number
    inicio: Date | string
    fim: Date | string
    status?: $Enums.StatusAgendamento
    observacao?: string | null
    valorTotal: Decimal | DecimalJsLike | number | string
    dataCriacao?: Date | string
    servicos?: AgendamentoServicoUncheckedCreateNestedManyWithoutAgendamentoInput
  }

  export type AgendamentoCreateOrConnectWithoutBarbeiroInput = {
    where: AgendamentoWhereUniqueInput
    create: XOR<AgendamentoCreateWithoutBarbeiroInput, AgendamentoUncheckedCreateWithoutBarbeiroInput>
  }

  export type AgendamentoCreateManyBarbeiroInputEnvelope = {
    data: AgendamentoCreateManyBarbeiroInput | AgendamentoCreateManyBarbeiroInput[]
    skipDuplicates?: boolean
  }

  export type FilialUpsertWithoutBarbeirosInput = {
    update: XOR<FilialUpdateWithoutBarbeirosInput, FilialUncheckedUpdateWithoutBarbeirosInput>
    create: XOR<FilialCreateWithoutBarbeirosInput, FilialUncheckedCreateWithoutBarbeirosInput>
    where?: FilialWhereInput
  }

  export type FilialUpdateToOneWithWhereWithoutBarbeirosInput = {
    where?: FilialWhereInput
    data: XOR<FilialUpdateWithoutBarbeirosInput, FilialUncheckedUpdateWithoutBarbeirosInput>
  }

  export type FilialUpdateWithoutBarbeirosInput = {
    nome?: StringFieldUpdateOperationsInput | string
    cnpj?: StringFieldUpdateOperationsInput | string
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    horarioAbertura?: NullableStringFieldUpdateOperationsInput | string | null
    horarioFechamento?: NullableStringFieldUpdateOperationsInput | string | null
    endereco?: EnderecoUpdateOneRequiredWithoutFilialNestedInput
    agendamentos?: AgendamentoUpdateManyWithoutFilialNestedInput
  }

  export type FilialUncheckedUpdateWithoutBarbeirosInput = {
    id?: IntFieldUpdateOperationsInput | number
    nome?: StringFieldUpdateOperationsInput | string
    cnpj?: StringFieldUpdateOperationsInput | string
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    horarioAbertura?: NullableStringFieldUpdateOperationsInput | string | null
    horarioFechamento?: NullableStringFieldUpdateOperationsInput | string | null
    idEndereco?: IntFieldUpdateOperationsInput | number
    agendamentos?: AgendamentoUncheckedUpdateManyWithoutFilialNestedInput
  }

  export type UsuarioUpsertWithoutBarbeiroInput = {
    update: XOR<UsuarioUpdateWithoutBarbeiroInput, UsuarioUncheckedUpdateWithoutBarbeiroInput>
    create: XOR<UsuarioCreateWithoutBarbeiroInput, UsuarioUncheckedCreateWithoutBarbeiroInput>
    where?: UsuarioWhereInput
  }

  export type UsuarioUpdateToOneWithWhereWithoutBarbeiroInput = {
    where?: UsuarioWhereInput
    data: XOR<UsuarioUpdateWithoutBarbeiroInput, UsuarioUncheckedUpdateWithoutBarbeiroInput>
  }

  export type UsuarioUpdateWithoutBarbeiroInput = {
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    senha?: StringFieldUpdateOperationsInput | string
    dataCadastro?: DateTimeFieldUpdateOperationsInput | Date | string
    tipoPerfil?: EnumTipoPerfilFieldUpdateOperationsInput | $Enums.TipoPerfil
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cliente?: ClienteUpdateOneWithoutUsuarioNestedInput
  }

  export type UsuarioUncheckedUpdateWithoutBarbeiroInput = {
    id?: IntFieldUpdateOperationsInput | number
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    senha?: StringFieldUpdateOperationsInput | string
    dataCadastro?: DateTimeFieldUpdateOperationsInput | Date | string
    tipoPerfil?: EnumTipoPerfilFieldUpdateOperationsInput | $Enums.TipoPerfil
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cliente?: ClienteUncheckedUpdateOneWithoutUsuarioNestedInput
  }

  export type AgendamentoUpsertWithWhereUniqueWithoutBarbeiroInput = {
    where: AgendamentoWhereUniqueInput
    update: XOR<AgendamentoUpdateWithoutBarbeiroInput, AgendamentoUncheckedUpdateWithoutBarbeiroInput>
    create: XOR<AgendamentoCreateWithoutBarbeiroInput, AgendamentoUncheckedCreateWithoutBarbeiroInput>
  }

  export type AgendamentoUpdateWithWhereUniqueWithoutBarbeiroInput = {
    where: AgendamentoWhereUniqueInput
    data: XOR<AgendamentoUpdateWithoutBarbeiroInput, AgendamentoUncheckedUpdateWithoutBarbeiroInput>
  }

  export type AgendamentoUpdateManyWithWhereWithoutBarbeiroInput = {
    where: AgendamentoScalarWhereInput
    data: XOR<AgendamentoUpdateManyMutationInput, AgendamentoUncheckedUpdateManyWithoutBarbeiroInput>
  }

  export type EnderecoCreateWithoutFilialInput = {
    cep: string
    logradouro: string
    numero: string
    bairro: string
    cidade: string
    estado: string
  }

  export type EnderecoUncheckedCreateWithoutFilialInput = {
    id?: number
    cep: string
    logradouro: string
    numero: string
    bairro: string
    cidade: string
    estado: string
  }

  export type EnderecoCreateOrConnectWithoutFilialInput = {
    where: EnderecoWhereUniqueInput
    create: XOR<EnderecoCreateWithoutFilialInput, EnderecoUncheckedCreateWithoutFilialInput>
  }

  export type BarbeiroCreateWithoutFilialInput = {
    descricao?: string | null
    dataAdmissao?: Date | string | null
    status?: $Enums.StatusBarbeiro
    usuario: UsuarioCreateNestedOneWithoutBarbeiroInput
    agendamentos?: AgendamentoCreateNestedManyWithoutBarbeiroInput
  }

  export type BarbeiroUncheckedCreateWithoutFilialInput = {
    id: number
    descricao?: string | null
    dataAdmissao?: Date | string | null
    status?: $Enums.StatusBarbeiro
    agendamentos?: AgendamentoUncheckedCreateNestedManyWithoutBarbeiroInput
  }

  export type BarbeiroCreateOrConnectWithoutFilialInput = {
    where: BarbeiroWhereUniqueInput
    create: XOR<BarbeiroCreateWithoutFilialInput, BarbeiroUncheckedCreateWithoutFilialInput>
  }

  export type BarbeiroCreateManyFilialInputEnvelope = {
    data: BarbeiroCreateManyFilialInput | BarbeiroCreateManyFilialInput[]
    skipDuplicates?: boolean
  }

  export type AgendamentoCreateWithoutFilialInput = {
    inicio: Date | string
    fim: Date | string
    status?: $Enums.StatusAgendamento
    observacao?: string | null
    valorTotal: Decimal | DecimalJsLike | number | string
    dataCriacao?: Date | string
    cliente: ClienteCreateNestedOneWithoutAgendamentosInput
    barbeiro: BarbeiroCreateNestedOneWithoutAgendamentosInput
    servicos?: AgendamentoServicoCreateNestedManyWithoutAgendamentoInput
  }

  export type AgendamentoUncheckedCreateWithoutFilialInput = {
    id?: number
    idCliente: number
    idBarbeiro: number
    inicio: Date | string
    fim: Date | string
    status?: $Enums.StatusAgendamento
    observacao?: string | null
    valorTotal: Decimal | DecimalJsLike | number | string
    dataCriacao?: Date | string
    servicos?: AgendamentoServicoUncheckedCreateNestedManyWithoutAgendamentoInput
  }

  export type AgendamentoCreateOrConnectWithoutFilialInput = {
    where: AgendamentoWhereUniqueInput
    create: XOR<AgendamentoCreateWithoutFilialInput, AgendamentoUncheckedCreateWithoutFilialInput>
  }

  export type AgendamentoCreateManyFilialInputEnvelope = {
    data: AgendamentoCreateManyFilialInput | AgendamentoCreateManyFilialInput[]
    skipDuplicates?: boolean
  }

  export type EnderecoUpsertWithoutFilialInput = {
    update: XOR<EnderecoUpdateWithoutFilialInput, EnderecoUncheckedUpdateWithoutFilialInput>
    create: XOR<EnderecoCreateWithoutFilialInput, EnderecoUncheckedCreateWithoutFilialInput>
    where?: EnderecoWhereInput
  }

  export type EnderecoUpdateToOneWithWhereWithoutFilialInput = {
    where?: EnderecoWhereInput
    data: XOR<EnderecoUpdateWithoutFilialInput, EnderecoUncheckedUpdateWithoutFilialInput>
  }

  export type EnderecoUpdateWithoutFilialInput = {
    cep?: StringFieldUpdateOperationsInput | string
    logradouro?: StringFieldUpdateOperationsInput | string
    numero?: StringFieldUpdateOperationsInput | string
    bairro?: StringFieldUpdateOperationsInput | string
    cidade?: StringFieldUpdateOperationsInput | string
    estado?: StringFieldUpdateOperationsInput | string
  }

  export type EnderecoUncheckedUpdateWithoutFilialInput = {
    id?: IntFieldUpdateOperationsInput | number
    cep?: StringFieldUpdateOperationsInput | string
    logradouro?: StringFieldUpdateOperationsInput | string
    numero?: StringFieldUpdateOperationsInput | string
    bairro?: StringFieldUpdateOperationsInput | string
    cidade?: StringFieldUpdateOperationsInput | string
    estado?: StringFieldUpdateOperationsInput | string
  }

  export type BarbeiroUpsertWithWhereUniqueWithoutFilialInput = {
    where: BarbeiroWhereUniqueInput
    update: XOR<BarbeiroUpdateWithoutFilialInput, BarbeiroUncheckedUpdateWithoutFilialInput>
    create: XOR<BarbeiroCreateWithoutFilialInput, BarbeiroUncheckedCreateWithoutFilialInput>
  }

  export type BarbeiroUpdateWithWhereUniqueWithoutFilialInput = {
    where: BarbeiroWhereUniqueInput
    data: XOR<BarbeiroUpdateWithoutFilialInput, BarbeiroUncheckedUpdateWithoutFilialInput>
  }

  export type BarbeiroUpdateManyWithWhereWithoutFilialInput = {
    where: BarbeiroScalarWhereInput
    data: XOR<BarbeiroUpdateManyMutationInput, BarbeiroUncheckedUpdateManyWithoutFilialInput>
  }

  export type BarbeiroScalarWhereInput = {
    AND?: BarbeiroScalarWhereInput | BarbeiroScalarWhereInput[]
    OR?: BarbeiroScalarWhereInput[]
    NOT?: BarbeiroScalarWhereInput | BarbeiroScalarWhereInput[]
    id?: IntFilter<"Barbeiro"> | number
    descricao?: StringNullableFilter<"Barbeiro"> | string | null
    dataAdmissao?: DateTimeNullableFilter<"Barbeiro"> | Date | string | null
    status?: EnumStatusBarbeiroFilter<"Barbeiro"> | $Enums.StatusBarbeiro
    idFilial?: IntFilter<"Barbeiro"> | number
  }

  export type AgendamentoUpsertWithWhereUniqueWithoutFilialInput = {
    where: AgendamentoWhereUniqueInput
    update: XOR<AgendamentoUpdateWithoutFilialInput, AgendamentoUncheckedUpdateWithoutFilialInput>
    create: XOR<AgendamentoCreateWithoutFilialInput, AgendamentoUncheckedCreateWithoutFilialInput>
  }

  export type AgendamentoUpdateWithWhereUniqueWithoutFilialInput = {
    where: AgendamentoWhereUniqueInput
    data: XOR<AgendamentoUpdateWithoutFilialInput, AgendamentoUncheckedUpdateWithoutFilialInput>
  }

  export type AgendamentoUpdateManyWithWhereWithoutFilialInput = {
    where: AgendamentoScalarWhereInput
    data: XOR<AgendamentoUpdateManyMutationInput, AgendamentoUncheckedUpdateManyWithoutFilialInput>
  }

  export type FilialCreateWithoutEnderecoInput = {
    nome: string
    cnpj: string
    telefone?: string | null
    email?: string | null
    horarioAbertura?: string | null
    horarioFechamento?: string | null
    barbeiros?: BarbeiroCreateNestedManyWithoutFilialInput
    agendamentos?: AgendamentoCreateNestedManyWithoutFilialInput
  }

  export type FilialUncheckedCreateWithoutEnderecoInput = {
    id?: number
    nome: string
    cnpj: string
    telefone?: string | null
    email?: string | null
    horarioAbertura?: string | null
    horarioFechamento?: string | null
    barbeiros?: BarbeiroUncheckedCreateNestedManyWithoutFilialInput
    agendamentos?: AgendamentoUncheckedCreateNestedManyWithoutFilialInput
  }

  export type FilialCreateOrConnectWithoutEnderecoInput = {
    where: FilialWhereUniqueInput
    create: XOR<FilialCreateWithoutEnderecoInput, FilialUncheckedCreateWithoutEnderecoInput>
  }

  export type FilialUpsertWithoutEnderecoInput = {
    update: XOR<FilialUpdateWithoutEnderecoInput, FilialUncheckedUpdateWithoutEnderecoInput>
    create: XOR<FilialCreateWithoutEnderecoInput, FilialUncheckedCreateWithoutEnderecoInput>
    where?: FilialWhereInput
  }

  export type FilialUpdateToOneWithWhereWithoutEnderecoInput = {
    where?: FilialWhereInput
    data: XOR<FilialUpdateWithoutEnderecoInput, FilialUncheckedUpdateWithoutEnderecoInput>
  }

  export type FilialUpdateWithoutEnderecoInput = {
    nome?: StringFieldUpdateOperationsInput | string
    cnpj?: StringFieldUpdateOperationsInput | string
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    horarioAbertura?: NullableStringFieldUpdateOperationsInput | string | null
    horarioFechamento?: NullableStringFieldUpdateOperationsInput | string | null
    barbeiros?: BarbeiroUpdateManyWithoutFilialNestedInput
    agendamentos?: AgendamentoUpdateManyWithoutFilialNestedInput
  }

  export type FilialUncheckedUpdateWithoutEnderecoInput = {
    id?: IntFieldUpdateOperationsInput | number
    nome?: StringFieldUpdateOperationsInput | string
    cnpj?: StringFieldUpdateOperationsInput | string
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    horarioAbertura?: NullableStringFieldUpdateOperationsInput | string | null
    horarioFechamento?: NullableStringFieldUpdateOperationsInput | string | null
    barbeiros?: BarbeiroUncheckedUpdateManyWithoutFilialNestedInput
    agendamentos?: AgendamentoUncheckedUpdateManyWithoutFilialNestedInput
  }

  export type AgendamentoServicoCreateWithoutServicoInput = {
    preco: Decimal | DecimalJsLike | number | string
    duracaoMinutos: number
    agendamento: AgendamentoCreateNestedOneWithoutServicosInput
  }

  export type AgendamentoServicoUncheckedCreateWithoutServicoInput = {
    id?: number
    idAgendamento: number
    preco: Decimal | DecimalJsLike | number | string
    duracaoMinutos: number
  }

  export type AgendamentoServicoCreateOrConnectWithoutServicoInput = {
    where: AgendamentoServicoWhereUniqueInput
    create: XOR<AgendamentoServicoCreateWithoutServicoInput, AgendamentoServicoUncheckedCreateWithoutServicoInput>
  }

  export type AgendamentoServicoCreateManyServicoInputEnvelope = {
    data: AgendamentoServicoCreateManyServicoInput | AgendamentoServicoCreateManyServicoInput[]
    skipDuplicates?: boolean
  }

  export type AgendamentoServicoUpsertWithWhereUniqueWithoutServicoInput = {
    where: AgendamentoServicoWhereUniqueInput
    update: XOR<AgendamentoServicoUpdateWithoutServicoInput, AgendamentoServicoUncheckedUpdateWithoutServicoInput>
    create: XOR<AgendamentoServicoCreateWithoutServicoInput, AgendamentoServicoUncheckedCreateWithoutServicoInput>
  }

  export type AgendamentoServicoUpdateWithWhereUniqueWithoutServicoInput = {
    where: AgendamentoServicoWhereUniqueInput
    data: XOR<AgendamentoServicoUpdateWithoutServicoInput, AgendamentoServicoUncheckedUpdateWithoutServicoInput>
  }

  export type AgendamentoServicoUpdateManyWithWhereWithoutServicoInput = {
    where: AgendamentoServicoScalarWhereInput
    data: XOR<AgendamentoServicoUpdateManyMutationInput, AgendamentoServicoUncheckedUpdateManyWithoutServicoInput>
  }

  export type AgendamentoServicoScalarWhereInput = {
    AND?: AgendamentoServicoScalarWhereInput | AgendamentoServicoScalarWhereInput[]
    OR?: AgendamentoServicoScalarWhereInput[]
    NOT?: AgendamentoServicoScalarWhereInput | AgendamentoServicoScalarWhereInput[]
    id?: IntFilter<"AgendamentoServico"> | number
    idAgendamento?: IntFilter<"AgendamentoServico"> | number
    idServico?: IntFilter<"AgendamentoServico"> | number
    preco?: DecimalFilter<"AgendamentoServico"> | Decimal | DecimalJsLike | number | string
    duracaoMinutos?: IntFilter<"AgendamentoServico"> | number
  }

  export type ClienteCreateWithoutAgendamentosInput = {
    cpf: string
    dataNascimento?: Date | string | null
    usuario: UsuarioCreateNestedOneWithoutClienteInput
  }

  export type ClienteUncheckedCreateWithoutAgendamentosInput = {
    id: number
    cpf: string
    dataNascimento?: Date | string | null
  }

  export type ClienteCreateOrConnectWithoutAgendamentosInput = {
    where: ClienteWhereUniqueInput
    create: XOR<ClienteCreateWithoutAgendamentosInput, ClienteUncheckedCreateWithoutAgendamentosInput>
  }

  export type BarbeiroCreateWithoutAgendamentosInput = {
    descricao?: string | null
    dataAdmissao?: Date | string | null
    status?: $Enums.StatusBarbeiro
    filial: FilialCreateNestedOneWithoutBarbeirosInput
    usuario: UsuarioCreateNestedOneWithoutBarbeiroInput
  }

  export type BarbeiroUncheckedCreateWithoutAgendamentosInput = {
    id: number
    descricao?: string | null
    dataAdmissao?: Date | string | null
    status?: $Enums.StatusBarbeiro
    idFilial: number
  }

  export type BarbeiroCreateOrConnectWithoutAgendamentosInput = {
    where: BarbeiroWhereUniqueInput
    create: XOR<BarbeiroCreateWithoutAgendamentosInput, BarbeiroUncheckedCreateWithoutAgendamentosInput>
  }

  export type FilialCreateWithoutAgendamentosInput = {
    nome: string
    cnpj: string
    telefone?: string | null
    email?: string | null
    horarioAbertura?: string | null
    horarioFechamento?: string | null
    endereco: EnderecoCreateNestedOneWithoutFilialInput
    barbeiros?: BarbeiroCreateNestedManyWithoutFilialInput
  }

  export type FilialUncheckedCreateWithoutAgendamentosInput = {
    id?: number
    nome: string
    cnpj: string
    telefone?: string | null
    email?: string | null
    horarioAbertura?: string | null
    horarioFechamento?: string | null
    idEndereco: number
    barbeiros?: BarbeiroUncheckedCreateNestedManyWithoutFilialInput
  }

  export type FilialCreateOrConnectWithoutAgendamentosInput = {
    where: FilialWhereUniqueInput
    create: XOR<FilialCreateWithoutAgendamentosInput, FilialUncheckedCreateWithoutAgendamentosInput>
  }

  export type AgendamentoServicoCreateWithoutAgendamentoInput = {
    preco: Decimal | DecimalJsLike | number | string
    duracaoMinutos: number
    servico: ServicoCreateNestedOneWithoutAgendamentosInput
  }

  export type AgendamentoServicoUncheckedCreateWithoutAgendamentoInput = {
    id?: number
    idServico: number
    preco: Decimal | DecimalJsLike | number | string
    duracaoMinutos: number
  }

  export type AgendamentoServicoCreateOrConnectWithoutAgendamentoInput = {
    where: AgendamentoServicoWhereUniqueInput
    create: XOR<AgendamentoServicoCreateWithoutAgendamentoInput, AgendamentoServicoUncheckedCreateWithoutAgendamentoInput>
  }

  export type AgendamentoServicoCreateManyAgendamentoInputEnvelope = {
    data: AgendamentoServicoCreateManyAgendamentoInput | AgendamentoServicoCreateManyAgendamentoInput[]
    skipDuplicates?: boolean
  }

  export type ClienteUpsertWithoutAgendamentosInput = {
    update: XOR<ClienteUpdateWithoutAgendamentosInput, ClienteUncheckedUpdateWithoutAgendamentosInput>
    create: XOR<ClienteCreateWithoutAgendamentosInput, ClienteUncheckedCreateWithoutAgendamentosInput>
    where?: ClienteWhereInput
  }

  export type ClienteUpdateToOneWithWhereWithoutAgendamentosInput = {
    where?: ClienteWhereInput
    data: XOR<ClienteUpdateWithoutAgendamentosInput, ClienteUncheckedUpdateWithoutAgendamentosInput>
  }

  export type ClienteUpdateWithoutAgendamentosInput = {
    cpf?: StringFieldUpdateOperationsInput | string
    dataNascimento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    usuario?: UsuarioUpdateOneRequiredWithoutClienteNestedInput
  }

  export type ClienteUncheckedUpdateWithoutAgendamentosInput = {
    id?: IntFieldUpdateOperationsInput | number
    cpf?: StringFieldUpdateOperationsInput | string
    dataNascimento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type BarbeiroUpsertWithoutAgendamentosInput = {
    update: XOR<BarbeiroUpdateWithoutAgendamentosInput, BarbeiroUncheckedUpdateWithoutAgendamentosInput>
    create: XOR<BarbeiroCreateWithoutAgendamentosInput, BarbeiroUncheckedCreateWithoutAgendamentosInput>
    where?: BarbeiroWhereInput
  }

  export type BarbeiroUpdateToOneWithWhereWithoutAgendamentosInput = {
    where?: BarbeiroWhereInput
    data: XOR<BarbeiroUpdateWithoutAgendamentosInput, BarbeiroUncheckedUpdateWithoutAgendamentosInput>
  }

  export type BarbeiroUpdateWithoutAgendamentosInput = {
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    dataAdmissao?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumStatusBarbeiroFieldUpdateOperationsInput | $Enums.StatusBarbeiro
    filial?: FilialUpdateOneRequiredWithoutBarbeirosNestedInput
    usuario?: UsuarioUpdateOneRequiredWithoutBarbeiroNestedInput
  }

  export type BarbeiroUncheckedUpdateWithoutAgendamentosInput = {
    id?: IntFieldUpdateOperationsInput | number
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    dataAdmissao?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumStatusBarbeiroFieldUpdateOperationsInput | $Enums.StatusBarbeiro
    idFilial?: IntFieldUpdateOperationsInput | number
  }

  export type FilialUpsertWithoutAgendamentosInput = {
    update: XOR<FilialUpdateWithoutAgendamentosInput, FilialUncheckedUpdateWithoutAgendamentosInput>
    create: XOR<FilialCreateWithoutAgendamentosInput, FilialUncheckedCreateWithoutAgendamentosInput>
    where?: FilialWhereInput
  }

  export type FilialUpdateToOneWithWhereWithoutAgendamentosInput = {
    where?: FilialWhereInput
    data: XOR<FilialUpdateWithoutAgendamentosInput, FilialUncheckedUpdateWithoutAgendamentosInput>
  }

  export type FilialUpdateWithoutAgendamentosInput = {
    nome?: StringFieldUpdateOperationsInput | string
    cnpj?: StringFieldUpdateOperationsInput | string
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    horarioAbertura?: NullableStringFieldUpdateOperationsInput | string | null
    horarioFechamento?: NullableStringFieldUpdateOperationsInput | string | null
    endereco?: EnderecoUpdateOneRequiredWithoutFilialNestedInput
    barbeiros?: BarbeiroUpdateManyWithoutFilialNestedInput
  }

  export type FilialUncheckedUpdateWithoutAgendamentosInput = {
    id?: IntFieldUpdateOperationsInput | number
    nome?: StringFieldUpdateOperationsInput | string
    cnpj?: StringFieldUpdateOperationsInput | string
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    horarioAbertura?: NullableStringFieldUpdateOperationsInput | string | null
    horarioFechamento?: NullableStringFieldUpdateOperationsInput | string | null
    idEndereco?: IntFieldUpdateOperationsInput | number
    barbeiros?: BarbeiroUncheckedUpdateManyWithoutFilialNestedInput
  }

  export type AgendamentoServicoUpsertWithWhereUniqueWithoutAgendamentoInput = {
    where: AgendamentoServicoWhereUniqueInput
    update: XOR<AgendamentoServicoUpdateWithoutAgendamentoInput, AgendamentoServicoUncheckedUpdateWithoutAgendamentoInput>
    create: XOR<AgendamentoServicoCreateWithoutAgendamentoInput, AgendamentoServicoUncheckedCreateWithoutAgendamentoInput>
  }

  export type AgendamentoServicoUpdateWithWhereUniqueWithoutAgendamentoInput = {
    where: AgendamentoServicoWhereUniqueInput
    data: XOR<AgendamentoServicoUpdateWithoutAgendamentoInput, AgendamentoServicoUncheckedUpdateWithoutAgendamentoInput>
  }

  export type AgendamentoServicoUpdateManyWithWhereWithoutAgendamentoInput = {
    where: AgendamentoServicoScalarWhereInput
    data: XOR<AgendamentoServicoUpdateManyMutationInput, AgendamentoServicoUncheckedUpdateManyWithoutAgendamentoInput>
  }

  export type AgendamentoCreateWithoutServicosInput = {
    inicio: Date | string
    fim: Date | string
    status?: $Enums.StatusAgendamento
    observacao?: string | null
    valorTotal: Decimal | DecimalJsLike | number | string
    dataCriacao?: Date | string
    cliente: ClienteCreateNestedOneWithoutAgendamentosInput
    barbeiro: BarbeiroCreateNestedOneWithoutAgendamentosInput
    filial: FilialCreateNestedOneWithoutAgendamentosInput
  }

  export type AgendamentoUncheckedCreateWithoutServicosInput = {
    id?: number
    idCliente: number
    idBarbeiro: number
    idFilial: number
    inicio: Date | string
    fim: Date | string
    status?: $Enums.StatusAgendamento
    observacao?: string | null
    valorTotal: Decimal | DecimalJsLike | number | string
    dataCriacao?: Date | string
  }

  export type AgendamentoCreateOrConnectWithoutServicosInput = {
    where: AgendamentoWhereUniqueInput
    create: XOR<AgendamentoCreateWithoutServicosInput, AgendamentoUncheckedCreateWithoutServicosInput>
  }

  export type ServicoCreateWithoutAgendamentosInput = {
    nome: string
    descricao?: string | null
    preco: Decimal | DecimalJsLike | number | string
    duracaoMinutos: number
  }

  export type ServicoUncheckedCreateWithoutAgendamentosInput = {
    id?: number
    nome: string
    descricao?: string | null
    preco: Decimal | DecimalJsLike | number | string
    duracaoMinutos: number
  }

  export type ServicoCreateOrConnectWithoutAgendamentosInput = {
    where: ServicoWhereUniqueInput
    create: XOR<ServicoCreateWithoutAgendamentosInput, ServicoUncheckedCreateWithoutAgendamentosInput>
  }

  export type AgendamentoUpsertWithoutServicosInput = {
    update: XOR<AgendamentoUpdateWithoutServicosInput, AgendamentoUncheckedUpdateWithoutServicosInput>
    create: XOR<AgendamentoCreateWithoutServicosInput, AgendamentoUncheckedCreateWithoutServicosInput>
    where?: AgendamentoWhereInput
  }

  export type AgendamentoUpdateToOneWithWhereWithoutServicosInput = {
    where?: AgendamentoWhereInput
    data: XOR<AgendamentoUpdateWithoutServicosInput, AgendamentoUncheckedUpdateWithoutServicosInput>
  }

  export type AgendamentoUpdateWithoutServicosInput = {
    inicio?: DateTimeFieldUpdateOperationsInput | Date | string
    fim?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumStatusAgendamentoFieldUpdateOperationsInput | $Enums.StatusAgendamento
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    valorTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    dataCriacao?: DateTimeFieldUpdateOperationsInput | Date | string
    cliente?: ClienteUpdateOneRequiredWithoutAgendamentosNestedInput
    barbeiro?: BarbeiroUpdateOneRequiredWithoutAgendamentosNestedInput
    filial?: FilialUpdateOneRequiredWithoutAgendamentosNestedInput
  }

  export type AgendamentoUncheckedUpdateWithoutServicosInput = {
    id?: IntFieldUpdateOperationsInput | number
    idCliente?: IntFieldUpdateOperationsInput | number
    idBarbeiro?: IntFieldUpdateOperationsInput | number
    idFilial?: IntFieldUpdateOperationsInput | number
    inicio?: DateTimeFieldUpdateOperationsInput | Date | string
    fim?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumStatusAgendamentoFieldUpdateOperationsInput | $Enums.StatusAgendamento
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    valorTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    dataCriacao?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ServicoUpsertWithoutAgendamentosInput = {
    update: XOR<ServicoUpdateWithoutAgendamentosInput, ServicoUncheckedUpdateWithoutAgendamentosInput>
    create: XOR<ServicoCreateWithoutAgendamentosInput, ServicoUncheckedCreateWithoutAgendamentosInput>
    where?: ServicoWhereInput
  }

  export type ServicoUpdateToOneWithWhereWithoutAgendamentosInput = {
    where?: ServicoWhereInput
    data: XOR<ServicoUpdateWithoutAgendamentosInput, ServicoUncheckedUpdateWithoutAgendamentosInput>
  }

  export type ServicoUpdateWithoutAgendamentosInput = {
    nome?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    preco?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    duracaoMinutos?: IntFieldUpdateOperationsInput | number
  }

  export type ServicoUncheckedUpdateWithoutAgendamentosInput = {
    id?: IntFieldUpdateOperationsInput | number
    nome?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    preco?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    duracaoMinutos?: IntFieldUpdateOperationsInput | number
  }

  export type AgendamentoCreateManyClienteInput = {
    id?: number
    idBarbeiro: number
    idFilial: number
    inicio: Date | string
    fim: Date | string
    status?: $Enums.StatusAgendamento
    observacao?: string | null
    valorTotal: Decimal | DecimalJsLike | number | string
    dataCriacao?: Date | string
  }

  export type AgendamentoUpdateWithoutClienteInput = {
    inicio?: DateTimeFieldUpdateOperationsInput | Date | string
    fim?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumStatusAgendamentoFieldUpdateOperationsInput | $Enums.StatusAgendamento
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    valorTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    dataCriacao?: DateTimeFieldUpdateOperationsInput | Date | string
    barbeiro?: BarbeiroUpdateOneRequiredWithoutAgendamentosNestedInput
    filial?: FilialUpdateOneRequiredWithoutAgendamentosNestedInput
    servicos?: AgendamentoServicoUpdateManyWithoutAgendamentoNestedInput
  }

  export type AgendamentoUncheckedUpdateWithoutClienteInput = {
    id?: IntFieldUpdateOperationsInput | number
    idBarbeiro?: IntFieldUpdateOperationsInput | number
    idFilial?: IntFieldUpdateOperationsInput | number
    inicio?: DateTimeFieldUpdateOperationsInput | Date | string
    fim?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumStatusAgendamentoFieldUpdateOperationsInput | $Enums.StatusAgendamento
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    valorTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    dataCriacao?: DateTimeFieldUpdateOperationsInput | Date | string
    servicos?: AgendamentoServicoUncheckedUpdateManyWithoutAgendamentoNestedInput
  }

  export type AgendamentoUncheckedUpdateManyWithoutClienteInput = {
    id?: IntFieldUpdateOperationsInput | number
    idBarbeiro?: IntFieldUpdateOperationsInput | number
    idFilial?: IntFieldUpdateOperationsInput | number
    inicio?: DateTimeFieldUpdateOperationsInput | Date | string
    fim?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumStatusAgendamentoFieldUpdateOperationsInput | $Enums.StatusAgendamento
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    valorTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    dataCriacao?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgendamentoCreateManyBarbeiroInput = {
    id?: number
    idCliente: number
    idFilial: number
    inicio: Date | string
    fim: Date | string
    status?: $Enums.StatusAgendamento
    observacao?: string | null
    valorTotal: Decimal | DecimalJsLike | number | string
    dataCriacao?: Date | string
  }

  export type AgendamentoUpdateWithoutBarbeiroInput = {
    inicio?: DateTimeFieldUpdateOperationsInput | Date | string
    fim?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumStatusAgendamentoFieldUpdateOperationsInput | $Enums.StatusAgendamento
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    valorTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    dataCriacao?: DateTimeFieldUpdateOperationsInput | Date | string
    cliente?: ClienteUpdateOneRequiredWithoutAgendamentosNestedInput
    filial?: FilialUpdateOneRequiredWithoutAgendamentosNestedInput
    servicos?: AgendamentoServicoUpdateManyWithoutAgendamentoNestedInput
  }

  export type AgendamentoUncheckedUpdateWithoutBarbeiroInput = {
    id?: IntFieldUpdateOperationsInput | number
    idCliente?: IntFieldUpdateOperationsInput | number
    idFilial?: IntFieldUpdateOperationsInput | number
    inicio?: DateTimeFieldUpdateOperationsInput | Date | string
    fim?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumStatusAgendamentoFieldUpdateOperationsInput | $Enums.StatusAgendamento
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    valorTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    dataCriacao?: DateTimeFieldUpdateOperationsInput | Date | string
    servicos?: AgendamentoServicoUncheckedUpdateManyWithoutAgendamentoNestedInput
  }

  export type AgendamentoUncheckedUpdateManyWithoutBarbeiroInput = {
    id?: IntFieldUpdateOperationsInput | number
    idCliente?: IntFieldUpdateOperationsInput | number
    idFilial?: IntFieldUpdateOperationsInput | number
    inicio?: DateTimeFieldUpdateOperationsInput | Date | string
    fim?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumStatusAgendamentoFieldUpdateOperationsInput | $Enums.StatusAgendamento
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    valorTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    dataCriacao?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BarbeiroCreateManyFilialInput = {
    id: number
    descricao?: string | null
    dataAdmissao?: Date | string | null
    status?: $Enums.StatusBarbeiro
  }

  export type AgendamentoCreateManyFilialInput = {
    id?: number
    idCliente: number
    idBarbeiro: number
    inicio: Date | string
    fim: Date | string
    status?: $Enums.StatusAgendamento
    observacao?: string | null
    valorTotal: Decimal | DecimalJsLike | number | string
    dataCriacao?: Date | string
  }

  export type BarbeiroUpdateWithoutFilialInput = {
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    dataAdmissao?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumStatusBarbeiroFieldUpdateOperationsInput | $Enums.StatusBarbeiro
    usuario?: UsuarioUpdateOneRequiredWithoutBarbeiroNestedInput
    agendamentos?: AgendamentoUpdateManyWithoutBarbeiroNestedInput
  }

  export type BarbeiroUncheckedUpdateWithoutFilialInput = {
    id?: IntFieldUpdateOperationsInput | number
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    dataAdmissao?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumStatusBarbeiroFieldUpdateOperationsInput | $Enums.StatusBarbeiro
    agendamentos?: AgendamentoUncheckedUpdateManyWithoutBarbeiroNestedInput
  }

  export type BarbeiroUncheckedUpdateManyWithoutFilialInput = {
    id?: IntFieldUpdateOperationsInput | number
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    dataAdmissao?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumStatusBarbeiroFieldUpdateOperationsInput | $Enums.StatusBarbeiro
  }

  export type AgendamentoUpdateWithoutFilialInput = {
    inicio?: DateTimeFieldUpdateOperationsInput | Date | string
    fim?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumStatusAgendamentoFieldUpdateOperationsInput | $Enums.StatusAgendamento
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    valorTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    dataCriacao?: DateTimeFieldUpdateOperationsInput | Date | string
    cliente?: ClienteUpdateOneRequiredWithoutAgendamentosNestedInput
    barbeiro?: BarbeiroUpdateOneRequiredWithoutAgendamentosNestedInput
    servicos?: AgendamentoServicoUpdateManyWithoutAgendamentoNestedInput
  }

  export type AgendamentoUncheckedUpdateWithoutFilialInput = {
    id?: IntFieldUpdateOperationsInput | number
    idCliente?: IntFieldUpdateOperationsInput | number
    idBarbeiro?: IntFieldUpdateOperationsInput | number
    inicio?: DateTimeFieldUpdateOperationsInput | Date | string
    fim?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumStatusAgendamentoFieldUpdateOperationsInput | $Enums.StatusAgendamento
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    valorTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    dataCriacao?: DateTimeFieldUpdateOperationsInput | Date | string
    servicos?: AgendamentoServicoUncheckedUpdateManyWithoutAgendamentoNestedInput
  }

  export type AgendamentoUncheckedUpdateManyWithoutFilialInput = {
    id?: IntFieldUpdateOperationsInput | number
    idCliente?: IntFieldUpdateOperationsInput | number
    idBarbeiro?: IntFieldUpdateOperationsInput | number
    inicio?: DateTimeFieldUpdateOperationsInput | Date | string
    fim?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumStatusAgendamentoFieldUpdateOperationsInput | $Enums.StatusAgendamento
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    valorTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    dataCriacao?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgendamentoServicoCreateManyServicoInput = {
    id?: number
    idAgendamento: number
    preco: Decimal | DecimalJsLike | number | string
    duracaoMinutos: number
  }

  export type AgendamentoServicoUpdateWithoutServicoInput = {
    preco?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    duracaoMinutos?: IntFieldUpdateOperationsInput | number
    agendamento?: AgendamentoUpdateOneRequiredWithoutServicosNestedInput
  }

  export type AgendamentoServicoUncheckedUpdateWithoutServicoInput = {
    id?: IntFieldUpdateOperationsInput | number
    idAgendamento?: IntFieldUpdateOperationsInput | number
    preco?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    duracaoMinutos?: IntFieldUpdateOperationsInput | number
  }

  export type AgendamentoServicoUncheckedUpdateManyWithoutServicoInput = {
    id?: IntFieldUpdateOperationsInput | number
    idAgendamento?: IntFieldUpdateOperationsInput | number
    preco?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    duracaoMinutos?: IntFieldUpdateOperationsInput | number
  }

  export type AgendamentoServicoCreateManyAgendamentoInput = {
    id?: number
    idServico: number
    preco: Decimal | DecimalJsLike | number | string
    duracaoMinutos: number
  }

  export type AgendamentoServicoUpdateWithoutAgendamentoInput = {
    preco?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    duracaoMinutos?: IntFieldUpdateOperationsInput | number
    servico?: ServicoUpdateOneRequiredWithoutAgendamentosNestedInput
  }

  export type AgendamentoServicoUncheckedUpdateWithoutAgendamentoInput = {
    id?: IntFieldUpdateOperationsInput | number
    idServico?: IntFieldUpdateOperationsInput | number
    preco?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    duracaoMinutos?: IntFieldUpdateOperationsInput | number
  }

  export type AgendamentoServicoUncheckedUpdateManyWithoutAgendamentoInput = {
    id?: IntFieldUpdateOperationsInput | number
    idServico?: IntFieldUpdateOperationsInput | number
    preco?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    duracaoMinutos?: IntFieldUpdateOperationsInput | number
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use ClienteCountOutputTypeDefaultArgs instead
     */
    export type ClienteCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ClienteCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use BarbeiroCountOutputTypeDefaultArgs instead
     */
    export type BarbeiroCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = BarbeiroCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use FilialCountOutputTypeDefaultArgs instead
     */
    export type FilialCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = FilialCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ServicoCountOutputTypeDefaultArgs instead
     */
    export type ServicoCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ServicoCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AgendamentoCountOutputTypeDefaultArgs instead
     */
    export type AgendamentoCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AgendamentoCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UsuarioDefaultArgs instead
     */
    export type UsuarioArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UsuarioDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ClienteDefaultArgs instead
     */
    export type ClienteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ClienteDefaultArgs<ExtArgs>
    /**
     * @deprecated Use BarbeiroDefaultArgs instead
     */
    export type BarbeiroArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = BarbeiroDefaultArgs<ExtArgs>
    /**
     * @deprecated Use FilialDefaultArgs instead
     */
    export type FilialArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = FilialDefaultArgs<ExtArgs>
    /**
     * @deprecated Use EnderecoDefaultArgs instead
     */
    export type EnderecoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = EnderecoDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ServicoDefaultArgs instead
     */
    export type ServicoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ServicoDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AgendamentoDefaultArgs instead
     */
    export type AgendamentoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AgendamentoDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AgendamentoServicoDefaultArgs instead
     */
    export type AgendamentoServicoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AgendamentoServicoDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}