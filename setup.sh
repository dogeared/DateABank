#! /bin/bash

NODE_INSTALL_LOCATION="$HOME/local/node-v$1"
ENV_FILE="$HOME/.bashrc"

NODE_DOWNLOAD_LOCATION="http://nodejs.org/dist"

### Don't edit anything below this line

NODE_VERSION=$1
NODE_FOLDER="node-v"
NODE_VERSION_TARBALL=$NODE_FOLDER$NODE_VERSION.tar.gz

function check_error {
  if [ $1 -ne 0 ]; then
    echo $2
    echo "You may need to cleanup:"
    echo -e "\t$NODE_INSTALL_LOCATION/"
    echo -e "\t$NODE_FOLDER$NODE_VERSION/"
    echo -e "\tnode-$NODE_VERSION.tar.gz"
    echo -e "\t$ENV_FILE"
    exit 1
  fi
}

function check_required {
  C=`which $1`
  
  check_error $? "$1 is required."
}

function check_node {
  NEED_NODE=1

  NODE=`which node`
  if [ $? -eq 0 ]; then
    CUR_NODE_VERSION=`node --version | cut -c2-`
    if [ $CUR_NODE_VERSION = $NODE_VERSION ]; then
      NEED_NODE=0
    elif [ -d $NODE_INSTALL_LOCATION -a -f $NODE_INSTALL_LOCATION/bin/node ]; then
      NEED_NODE=0
    fi
  fi
  
  if [ $NEED_NODE -eq 1 ]; then
    echo "Getting and building node..."
    if [ ! -f "$NODE_VERSION_TARBALL" ]; then
      wget -q "$NODE_DOWNLOAD_LOCATION/$NODE_VERSION_TARBALL"
      if [ $? -ne 0 ]; then
        wget -q "$NODE_DOWNLOAD_LOCATION/v$NODE_VERSION/$NODE_VERSION_TARBALL"
        check_error $? "unable to download $NODE_VERSION_TARBALL"
      fi
    fi
    tar xvfz $NODE_VERSION_TARBALL
    cd $NODE_FOLDER$NODE_VERSION
    ./configure --prefix=$NODE_INSTALL_LOCATION
    check_error $? "node configure failed"
    make install
    check_error $? "node install failed"
    ENV_FIX=`grep .node_home.sh $ENV_FILE`
    if [ $? -ne 0 ]; then
      echo ". $HOME/.node_home.sh" >> $ENV_FILE
    fi
  fi
  echo export PATH=$NODE_INSTALL_LOCATION/bin:\$PATH > $HOME/.node_home.sh
  export PATH=$NODE_INSTALL_LOCATION/bin:$PATH
}

function check_npm {
  NPM=`which npm | grep $NODE_VERSION`
  
  if [ $? -ne 0 ]; then
    echo "Installing npm..."
    curl http://npmjs.org/install.sh | sh
    check_error $? "npm install failed"
    if [ -d $HOME/.npm ]; then
      NOW=`date`
      mv $HOME/.npm "$HOME/.npm-$NOW"
    fi
  fi
}

function check_expresso {
  EXPRESSO=`which expresso | grep $NODE_VERSION`
  
  if [ $? -ne 0 ]; then
    echo "Installing expresso..."
    npm install -g expresso
    check_error $? "expresso install failed"
  fi
}

function check_peanut {
  PEANUT=`which peanut | grep $NODE_VERSION`
  
  if [ $? -ne 0 ]; then
    echo "Installing peanut..."
    npm install -g peanut
    check_error $? "peanut install failed"
  fi
}

function check_selenium {
  SELENIUM=`which selenium | grep $NODE_VERSION`
  
  if [ $? -ne 0 ]; then
    echo "Installing selenium for node..."
    npm install -g selenium
  fi
}

if [ -z $1 ]; then
  echo -e "usage: $0 <node version>\n\tex: $0 0.4.7"
  exit 1
fi
check_required curl
check_required wget
check_required tar
check_required make
check_required java
check_node
check_npm
check_expresso
check_peanut
check_selenium
