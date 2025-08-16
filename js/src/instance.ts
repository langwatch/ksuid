import { checkUint, checkUint8Array } from './validation.js';

/**
 * Instance scheme identifiers for different types of instance detection
 */
export interface InstanceScheme {
  /** Random identifier (82 = 'R' in ASCII) */
  RANDOM: 82;
  /** MAC address + PID identifier (72 = 'H' in ASCII) */
  MAC_AND_PID: 72;
  /** Docker container identifier (68 = 'D' in ASCII) */
  DOCKER_CONT: 68;
}

/** Type representing the possible instance scheme values */
export type InstanceSchemeType = InstanceScheme[keyof InstanceScheme];

/**
 * Represents a machine/container instance identifier
 * 
 * Instances are used to ensure uniqueness across different machines
 * or containers when generating KSUIDs simultaneously.
 * 
 * @example
 * ```typescript
 * const instance = new Instance(Instance.schemes.RANDOM, new Uint8Array(8));
 * const ksuid = new Ksuid('prod', 'user', Date.now(), instance, 0);
 * ```
 */
export class Instance {
  /** Available instance schemes */
  public static readonly schemes: InstanceScheme = {
    RANDOM: 82, // R
    MAC_AND_PID: 72, // H
    DOCKER_CONT: 68, // D
  } as const;

  private readonly _scheme: InstanceSchemeType;
  private readonly _identifier: Uint8Array;
  private _buffer?: Uint8Array;

  /**
   * Creates a new Instance with the specified scheme and identifier
   * @param scheme - The instance scheme (RANDOM, MAC_AND_PID, or DOCKER_CONT)
   * @param identifier - 8-byte identifier for the instance
   * @throws {ValidationError} If the scheme or identifier is invalid
   */
  constructor(scheme: InstanceSchemeType, identifier: Uint8Array) {
    checkUint('scheme', scheme, 1);
    checkUint8Array('identifier', identifier, 8);

    this._scheme = scheme;
    this._identifier = new Uint8Array(identifier);
  }

  /** The instance scheme (RANDOM, MAC_AND_PID, or DOCKER_CONT) */
  get scheme(): InstanceSchemeType {
    return this._scheme;
  }

  /** The 8-byte instance identifier */
  get identifier(): Uint8Array {
    return new Uint8Array(this._identifier);
  }

  /**
   * Converts the instance to a 9-byte buffer (scheme + identifier)
   * @returns A Uint8Array containing the scheme byte followed by the identifier
   * @example
   * ```typescript
   * const instance = new Instance(Instance.schemes.RANDOM, new Uint8Array(8));
   * const buffer = instance.toBuffer(); // 9 bytes: [82, 0, 0, 0, 0, 0, 0, 0, 0]
   * ```
   */
  toBuffer(): Uint8Array {
    // Cache the buffer since it's immutable
    if (this._buffer) {
      return new Uint8Array(this._buffer);
    }

    const buf = new Uint8Array(9);
    buf[0] = this._scheme;
    buf.set(this._identifier, 1);

    this._buffer = buf;
    return new Uint8Array(buf);
  }

  /**
   * Creates an Instance from a 9-byte buffer
   * @param buffer - A 9-byte buffer containing scheme byte + identifier
   * @returns A new Instance object
   * @throws {ValidationError} If the buffer is not exactly 9 bytes
   * @example
   * ```typescript
   * const buffer = new Uint8Array([82, 1, 2, 3, 4, 5, 6, 7, 8]);
   * const instance = Instance.fromBuffer(buffer);
   * ```
   */
  static fromBuffer(buffer: Uint8Array): Instance {
    checkUint8Array('buffer', buffer, 9);

    return new Instance(
      buffer[0] as InstanceSchemeType,
      buffer.slice(1),
    );
  }

  /**
   * Returns a string representation of the instance
   * @returns A string showing the scheme and identifier
   * @example
   * ```typescript
   * const instance = new Instance(Instance.schemes.RANDOM, new Uint8Array([1,2,3,4,5,6,7,8]));
   * console.log(instance.toString()); // 'Instance(scheme=82, identifier=1,2,3,4,5,6,7,8)'
   * ```
   */
  toString(): string {
    return `Instance(scheme=${this._scheme}, identifier=${this._identifier.toString()})`;
  }

  /**
   * Compares this instance with another for equality
   * @param other - The instance to compare with
   * @returns True if both instances have the same scheme and identifier
   * @example
   * ```typescript
   * const instance1 = new Instance(Instance.schemes.RANDOM, new Uint8Array(8));
   * const instance2 = new Instance(Instance.schemes.RANDOM, new Uint8Array(8));
   * console.log(instance1.equals(instance2)); // true
   * ```
   */
  equals(other: Instance): boolean {
    if (!(other instanceof Instance)) {
      return false;
    }
    return this._scheme === other._scheme &&
           this._identifier.every((byte, i) => byte === other._identifier[i]);
  }
}
