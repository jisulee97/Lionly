import { useNavigate } from 'react-router-dom';
import debounce from '@/utils/debounce';
import pb from '@/api/pocketbase';
import { useEffect, useState } from 'react';
import { useRef } from 'react';
import LinkButton from '../button/LinkButton';
import { toast } from 'react-hot-toast';
import { useAnimation, motion } from 'framer-motion';
function Login() {
  const navigate = useNavigate();
  const emailRef = useRef();
  const passwordRef = useRef();
  const controls = useAnimation();
  const [formState, setFormState] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    // 이미 로그인 된 상태에서 다시 로그인 페이지로 못넘아게 하기.
    const checkAuth = async () => {
      if (await pb.authStore.isValid) {
        navigate('/feed');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleSignIn = async (e) => {
    e.preventDefault();

    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    try {
      await pb.collection('users').authWithPassword(email, password);

      if (pb.authStore.isValid) {
        navigate('/feed');
        toast.success(`안녕하세요! ${pb.authStore.model.name}님`, {
          icon: '👏',
        });
      }
    } catch (error) {
      console.error(error);
      toast.error('아이디나 비밀번호가 틀렸습니다.');
      controls.start({
        x: [-5, 5, -5, 5, 0],
        transition: { duration: 0.5 },
      });
    }
  };

  const handleInput = debounce((e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  }, 400);

  return (
    <div>
      <form
        onSubmit={handleSignIn}
        className="flex flex-col items-center gap-1"
      >
        <label htmlFor="login"></label>
        <motion.input
          animate={controls}
          className="h-11 w-full rounded border border-lionly-white bg-transparent px-5 py-3 text-lionly-sm outline-none placeholder:text-lionly-white"
          placeholder="아이디를 입력해주세요"
          ref={emailRef}
          type="email"
          id="login"
          name="email"
          onChange={handleInput}
        />

        <label
          htmlFor="password"
          className=" block text-lionly-sm-bold text-lionly-white"
        ></label>
        <motion.input
          animate={controls}
          className="mb-1 h-11 w-full rounded border border-lionly-white bg-transparent px-5 py-3 text-lionly-sm outline-none placeholder:text-lionly-white"
          ref={passwordRef}
          placeholder="비밀번호를 입력해주세요"
          type="password"
          id="password"
          name="password"
          onChange={handleInput}
        />
        <div className="mb-14 "></div>

        <div className="flex w-full flex-col gap-2">
          <LinkButton type={'submit'} text={'로그인'} />
          <LinkButton
            color={'transparent'}
            text={'회원가입'}
            onClick={() => {
              navigate('/signup');
            }}
          />
        </div>
      </form>
    </div>
  );
}

export default Login;
