import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { keepPreviousData, useInfiniteQuery, useMutation, useQuery, useQueryClient, useSuspenseInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query'
import AxiosWorking from './components/AxiosWorking'

function App() {


  const [id, setId] = useState(1);
  const queryClient = useQueryClient()

  // THE ONLY THING WE NEED IS USEQUERY
  const {status, fetchStatus, data: posts, isLoading, error, refetch, isRefetching} = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
    // THIS TIME HELPS YOU CATCH THE DATA FOR CERTAIN AMOUNT OF TIME
    staleTime: 60000,
    // THIS TIME HELPS YOU KEEP DATA IN THE CATCHE
    gcTime: 60000,
    // THIS WILL NOT ALLOW TO FETCH DATA UNTIL THE USER.ID IS THERE
    // enable: On THIS WILL ALSO WORKS AS SWITCH IF YOU TURN ON DATA WILL BE FETCHED IF NOT THEN NO
    // enabled: !!user.id,
    // THIS WILL REFETCH AFTER EVERY 5 SECONDS
    // refetchInterval: 5000,
    // FETCHING IN BACKGROUND
    // refetchIntervalInBackground: 30000,
    // networkMode: 'always',
    // retry: 10,
    // retryDelay: 3000
    // placeholderData: keepPreviousData,
    // initialData: preloadSomeInitialData
  });

  // SCROLL TO GET MORE DATA
  // const {data: infiniteData, fetchNextPage, hasNextPage} = useInfiniteQuery({
  //   queryKey: ['posts/infinit'],
  //   queryFn: fetchInfinitePosts,
  //   initialPageParam: 1,
  //   getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
  // })

  // console.log(fetchNextPage, hasNextPage)

  // useSuspenseQuery()
  // useSuspenseInfiniteQuery()

  const {data: singlePost, isLoading: singlePostLoading} = useQuery({
    queryKey: ['single_post', id],
    queryFn: () => fetchSinglePost(id)
  });

  // call mutate function if you want to mutate data
  const mutation = useMutation({
    mutationKey: ['create_post'],
    mutationFn: createPost,
    // retry: 3,
    // retryDelay: 50000,
    onSuccess: () => {
      // FETCH NEW DATA FROM THE SERVER AS CREATED NEW POST
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    }
  });

  const createPostHandler = () => {
    console.log(mutation);
    // YOU CAN ADD ONERROR, ONSUCCESS, ONMUTATE ALSO HERE INSIDE THE .MUTATE FUNCTON
    mutation.mutate();
    // TO RESET THE STATE
    // mutation.reset();
  }

  
  



  return (
    <>
      <section>
        <h1>TANSTACK QUERY</h1>
        {
          error && <p>Error while fetching data</p>
        }
        {
          isLoading ? <p>Loading...</p> : <div>{JSON.stringify(posts)}</div>
        }
        <button onClick={() => refetch()}>
          {
            isRefetching ? 'Fetching data': 'Refresh data'
          }
        </button>

        <h3>Single Post</h3>
        {
          singlePost ? <div>{JSON.stringify(singlePost)}</div> : <p>Loading....</p>
        }
        <button onClick={() => setId(prev => prev - 1)}>Prev</button>
        <button onClick={() => setId(prev => prev + 1)}>Next</button>

        <h3>Create Post</h3>
        {
          mutation.isError && <p>Something wrong while creating post</p>
        }
        {
          mutation.isPending && <p>Adding post...</p>
        }
        {
          mutation.isSuccess && <p>Post created successfully.</p>
        }
        <button onClick={createPostHandler}>Create Post</button>
        <AxiosWorking />
      </section> 
    </>
  )
}

export default App


async function getPosts() {
  const request = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
  const response = await request.json();
  return response;
}
async function fetchSinglePost(id) {
  const request = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  const response = await request.json();
  return response;
}
async function fetchInfinitePosts() {
  const request = await fetch(`https://jsonplaceholder.typicode.com/posts`);
  const response = await request.json();
  return response;
}
async function createPost() {
  const request = await fetch(`https://jsonplaceholder.typicode.com/posts`, {
    method: 'POST',
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      userId: 2,
      title: "the man in the shadow",
      body: "SOmething special included in this post."
    })
  });
  const response = await request.json();
  return response;
}
