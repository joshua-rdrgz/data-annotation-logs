export const SignUpSuccessPage = () => {
  return (
    <div className='h-screen flex flex-col justify-center items-center gap-2 mx-10'>
      <h1 className='text-3xl font-bold'>Sign up successful!</h1>
      <h2 className='text-xl text-muted-foreground text-center'>
        <span className='block'>
          Look in your email to verify your account.
        </span>
        <span className='block'>You may close this window now!</span>
      </h2>
    </div>
  );
};
