import createApiServer from './shared/createApiServer';

async function main() {
  console.log('_____________________starting');
  try {
    const { server, api } = await createApiServer();
    const port = 23001;
    server.listen(port, () => {
      console.log(`➠  Api Server is running`);
      console.log(`http://127.0.0.1:${port}`);
      console.log(``);
    });

    return api;
  } catch (error) {
    console.error(error.message);
    // console.error(error.stack);
    process.exit(1);
  }
}


main();