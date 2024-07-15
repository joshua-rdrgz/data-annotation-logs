interface UserSettingsFormWrapperProps extends React.PropsWithChildren {
  heading: string;
}

export const UserSettingsFormWrapper = ({
  children,
  heading,
}: UserSettingsFormWrapperProps) => {
  return (
    <section className='w-full sm:w-2/3 md:w-1/2'>
      <header className='text-2xl font-bold mb-4'>{heading}</header>
      {children}
    </section>
  );
};
