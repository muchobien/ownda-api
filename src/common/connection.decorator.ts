import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function ConnectionArgsConstraint(
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'connectionArgsConstraint',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(_: unknown, args: ValidationArguments) {
          const { first, last, before, after } = args.object as any;
          if (first != null && last != null) {
            return false;
          }

          if (after != null && before != null) {
            return false;
          }

          if (after != null && first == null) {
            return false;
          }

          if (before != null && last == null) {
            return false;
          }

          if (first != null && first <= 0) {
            return false;
          }

          if (last != null && last <= 0) {
            return false;
          }

          return true;
        },
        defaultMessage(args: ValidationArguments) {
          const { first, last, before, after } = args.object as any;

          if (first != null && last != null) {
            return 'Only one of "first" and "last" can be set';
          }

          if (after != null && before != null) {
            return 'Only one of "after" and "before" can be set';
          }

          // If `after` is set, `first` has to be set
          if (after != null && first == null) {
            return '"after" needs to be used with "first"';
          }

          // If `before` is set, `last` has to be set
          if (before != null && last == null) {
            return '"before" needs to be used with "last"';
          }

          // `first` and `last` have to be positive
          if (first != null && first <= 0) {
            return '"first" has to be positive';
          }

          if (last != null && last <= 0) {
            return '"last" has to be positive';
          }

          return '';
        },
      },
    });
  };
}
